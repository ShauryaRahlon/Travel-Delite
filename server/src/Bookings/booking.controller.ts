import type { Request, Response } from "express";
import { prisma } from "../db.js";
import { z } from "zod";
import { calculateDiscountedPrice } from "../utils/promoCodes.js";
import { serverCache } from "../utils/cache.js";

const bookingSchema = z.object({
  experienceId: z.string().cuid(),
  slotId: z.string().cuid(),
  userName: z.string().nonempty(),
  userEmail: z.string().email(),
  finalPrice: z.number().positive(),
  promoCode: z.string().optional(),
});
// POST /bookings
export const createBooking = async (req: Request, res: Response) => {
  // 1. Validate Input
  const validation = bookingSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ errors: validation.error.issues });
  }

  const { experienceId, slotId, userName, userEmail, finalPrice, promoCode } =
    validation.data;

  try {
    // 2. Validate promo code and calculate actual price
    let calculatedPrice = finalPrice;
    let discountAmount = 0;
    let promoDetails = null;

    if (promoCode) {
      const result = calculateDiscountedPrice(finalPrice, promoCode);

      if (!result.promoDetails) {
        return res.status(400).json({ message: "Invalid promo code" });
      }

      calculatedPrice = result.discountedPrice;
      discountAmount = result.discountAmount;
      promoDetails = result.promoDetails;
    }

    // 3. Use a transaction to ensure atomicity
    const booking = await prisma.$transaction(async (tx?: any) => {
      // 3. Atomically update the slot *only if* it has space.
      // This is the core logic to prevent double booking. If any step fails this will roll back the entire transaction
      const slot = await tx.slot.update({
        where: {
          id: slotId,
          // Check that (booked + 1) is not greater than total
          bookedTickets: {
            lt:
              (
                await tx.slot.findUnique({
                  where: { id: slotId },
                  select: { totalTickets: true },
                })
              )?.totalTickets || 0,
          },
        },
        data: {
          bookedTickets: { increment: 1 }, // Atomically increment
        },
      });

      // (Simplified version if you check against a static number)
      // const slot = await tx.slot.update({
      //   where: {
      //     id: slotId,
      //     bookedTickets: { lt: 20 } // Fails if bookedTickets is 20
      //   },
      //   data: {
      //     bookedTickets: { increment: 1 }
      //   }
      // });

      // 4. If the update succeeded, create the booking
      const newBooking = await tx.booking.create({
        data: {
          userName: userName,
          userEmail: userEmail,
          finalPrice: calculatedPrice, // Use calculated price, not the input price
          promoCode: promoCode,
          experienceId: experienceId,
          slotId: slotId,
        },
      });

      return newBooking;
    });

    // 5. If transaction succeeded
    // Invalidate cache as availability has changed
    serverCache.delete("all_experiences");
    serverCache.delete(`experience_${experienceId}`);
    console.log(
      `Cache invalidated for experience ${experienceId} after booking`
    );

    res.status(201).json({
      ...booking,
      promoDetails: promoDetails,
      originalPrice: finalPrice,
      discountApplied: discountAmount,
      finalPrice: calculatedPrice,
    });
  } catch (error: any) {
    // 6. If transaction failed
    // This 'P2025' code fires if the 'where' clause fails
    // (e.g., slot not found OR tickets are full)
    if (error.code === "P2025") {
      res.status(400).json({ message: "Slot is sold out or not found." });
    } else {
      res.status(500).json({ message: "Booking failed", error: error.message });
    }
  }
};
