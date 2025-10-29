// prisma/seed.ts

import { PrismaClient } from "@prisma/client";

// Initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  // 1. Delete all existing data
  console.log("Start seeding...");
  await prisma.booking.deleteMany();
  await prisma.slot.deleteMany();
  await prisma.experience.deleteMany();
  // (Add promo code deletion if you add that model)

  console.log("Deleted all existing data.");

  // 2. Create "Experiences"
  const experience1 = await prisma.experience.create({
    data: {
      name: "Mountain Hiking Adventure",
      description: "A breathtaking hike through the scenic mountain trails.",
      imageUrl: "https://images.unsplash.com/photo-1551632811-561732d1e306",
      price: 75.0,

      // 3. Create nested "Slots" for this experience
      slots: {
        create: [
          {
            date: new Date("2025-12-01T00:00:00Z"),
            time: "09:00 AM",
            totalTickets: 20,
          },
          {
            date: new Date("2025-12-01T00:00:00Z"),
            time: "01:00 PM",
            totalTickets: 20,
          },
          {
            date: new Date("2025-12-02T00:00:00Z"),
            time: "09:00 AM",
            totalTickets: 15, // Different total
          },
        ],
      },
    },
  });

  const experience2 = await prisma.experience.create({
    data: {
      name: "City Culinary Tour",
      description: "Taste the best foods the city has to offer.",
      imageUrl: "https://images.unsplash.com/photo-1547928574-0a5d33c7c3e5",
      price: 120.0,
      // This experience has no slots yet
    },
  });

  console.log(`Created ${experience1.name} with 3 slots.`);
  console.log(`Created ${experience2.name} with 0 slots.`);

  // 4. (Optional) Create Promo Codes if you made a model for it
  // If you are hard-coding them as I did, you can skip this.
  // If you made a `Promo` model:
  /*
  await prisma.promo.createMany({
    data: [
      { code: 'SAVE10', type: 'percentage', value: 10 },
      { code: 'FLAT100', type: 'fixed', value: 100 },
    ],
  });
  console.log('Created 2 promo codes.');
  */

  console.log("Seeding finished.");
}

// 5. Execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // Close the Prisma Client connection
    await prisma.$disconnect();
  });
