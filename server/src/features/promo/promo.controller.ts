import { request, response } from "express";
import { z } from "zod";
import { validatePromoCode as validateCode } from "../../utils/promoCodes.js";

// Define a schema for the incoming request body
const promoSchema = z.object({
  code: z.string().nonempty("Promo code is required"),
});

export const validatePromoCode = (
  req: typeof request,
  res: typeof response
) => {
  const validation = promoSchema.safeParse(req.body);
  if (!validation.success) {
    return res
      .status(400)
      .json({ errors: validation.error.issues.map((e) => e.message) });
  }

  const { code } = validation.data;
  const promo = validateCode(code);

  if (!promo) {
    return res.status(404).json({ message: "Promo code not found" });
  }
  res.status(200).json({
    message: "Promo code applied successfully",
    promoDetails: promo,
  });
};
