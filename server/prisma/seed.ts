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
      name: "Kayaking Adventure",
      description:
        "Curated small-group experience. Certified guide. Safety first with gear included.",
      imageUrl:
        "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
      price: 999.0,
      slots: {
        create: [
          {
            date: new Date("2025-12-01T00:00:00Z"),
            time: "06:00 AM",
            totalTickets: 12,
          },
          {
            date: new Date("2025-12-01T00:00:00Z"),
            time: "02:00 PM",
            totalTickets: 12,
          },
          {
            date: new Date("2025-12-02T00:00:00Z"),
            time: "06:00 AM",
            totalTickets: 15,
          },
        ],
      },
    },
  });

  const experience3 = await prisma.experience.create({
    data: {
      name: "Nandi Hills Sunrise",
      description:
        "Curated small-group experience. Certified guide. Safety first with gear included.",
      imageUrl:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      price: 899.0,
      slots: {
        create: [
          {
            date: new Date("2025-12-01T00:00:00Z"),
            time: "05:00 AM",
            totalTickets: 25,
          },
          {
            date: new Date("2025-12-02T00:00:00Z"),
            time: "05:00 AM",
            totalTickets: 25,
          },
          {
            date: new Date("2025-12-03T00:00:00Z"),
            time: "05:00 AM",
            totalTickets: 20,
          },
        ],
      },
    },
  });

  const experience4 = await prisma.experience.create({
    data: {
      name: "Coffee Trail",
      description:
        "Curated small-group experience. Certified guide. Safety first with gear included.",
      imageUrl:
        "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800",
      price: 1299.0,
      slots: {
        create: [
          {
            date: new Date("2025-12-01T00:00:00Z"),
            time: "08:00 AM",
            totalTickets: 15,
          },
          {
            date: new Date("2025-12-01T00:00:00Z"),
            time: "01:00 PM",
            totalTickets: 15,
          },
          {
            date: new Date("2025-12-02T00:00:00Z"),
            time: "08:00 AM",
            totalTickets: 18,
          },
        ],
      },
    },
  });

  const experience5 = await prisma.experience.create({
    data: {
      name: "Boat Cruise",
      description:
        "Curated small-group experience. Certified guide. Safety first with gear included.",
      imageUrl:
        "https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=800",
      price: 999.0,
      slots: {
        create: [
          {
            date: new Date("2025-12-01T00:00:00Z"),
            time: "10:00 AM",
            totalTickets: 30,
          },
          {
            date: new Date("2025-12-01T00:00:00Z"),
            time: "04:00 PM",
            totalTickets: 30,
          },
          {
            date: new Date("2025-12-01T00:00:00Z"),
            time: "06:30 PM",
            totalTickets: 25,
          },
        ],
      },
    },
  });

  const experience6 = await prisma.experience.create({
    data: {
      name: "Bunjee Jumping",
      description:
        "Curated small-group experience. Certified guide. Safety first with gear included.",
      imageUrl:
        "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800",
      price: 999.0,
      slots: {
        create: [
          {
            date: new Date("2025-12-01T00:00:00Z"),
            time: "09:00 AM",
            totalTickets: 10,
          },
          {
            date: new Date("2025-12-01T00:00:00Z"),
            time: "12:00 PM",
            totalTickets: 10,
          },
          {
            date: new Date("2025-12-01T00:00:00Z"),
            time: "03:00 PM",
            totalTickets: 8,
          },
        ],
      },
    },
  });

  const experience7 = await prisma.experience.create({
    data: {
      name: "Forest Trekking",
      description:
        "Curated small-group experience. Certified guide. Safety first with gear included.",
      imageUrl:
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
      price: 1299.0,
      slots: {
        create: [
          {
            date: new Date("2025-12-01T00:00:00Z"),
            time: "06:00 AM",
            totalTickets: 20,
          },
          {
            date: new Date("2025-12-02T00:00:00Z"),
            time: "06:00 AM",
            totalTickets: 20,
          },
        ],
      },
    },
  });

  const experience8 = await prisma.experience.create({
    data: {
      name: "Rock Climbing",
      description:
        "Curated small-group experience. Certified guide. Safety first with gear included.",
      imageUrl:
        "https://images.unsplash.com/photo-1522163182402-834f871fd851?w=800",
      price: 1499.0,
      slots: {
        create: [
          {
            date: new Date("2025-12-01T00:00:00Z"),
            time: "07:00 AM",
            totalTickets: 8,
          },
          {
            date: new Date("2025-12-01T00:00:00Z"),
            time: "02:00 PM",
            totalTickets: 8,
          },
        ],
      },
    },
  });

  const experience9 = await prisma.experience.create({
    data: {
      name: "Camping Under Stars",
      description:
        "Curated small-group experience. Certified guide. Safety first with gear included.",
      imageUrl:
        "https://images.unsplash.com/photo-1504851149312-7a075b496cc7?w=800",
      price: 1899.0,
      slots: {
        create: [
          {
            date: new Date("2025-12-01T00:00:00Z"),
            time: "05:00 PM",
            totalTickets: 15,
          },
          {
            date: new Date("2025-12-07T00:00:00Z"),
            time: "05:00 PM",
            totalTickets: 15,
          },
        ],
      },
    },
  });

  const experience10 = await prisma.experience.create({
    data: {
      name: "Beach Volleyball",
      description:
        "Curated small-group experience. Certified guide. Safety first with gear included.",
      imageUrl:
        "https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=800",
      price: 799.0,
      slots: {
        create: [
          {
            date: new Date("2025-12-01T00:00:00Z"),
            time: "04:00 PM",
            totalTickets: 16,
          },
          {
            date: new Date("2025-12-01T00:00:00Z"),
            time: "06:00 PM",
            totalTickets: 16,
          },
        ],
      },
    },
  });

  console.log(`Created ${experience1.name} with 3 slots.`);
  console.log(`Created ${experience2.name} with 3 slots.`);
  console.log(`Created ${experience3.name} with 3 slots.`);
  console.log(`Created ${experience4.name} with 3 slots.`);
  console.log(`Created ${experience5.name} with 3 slots.`);
  console.log(`Created ${experience6.name} with 3 slots.`);
  console.log(`Created ${experience7.name} with 2 slots.`);
  console.log(`Created ${experience8.name} with 2 slots.`);
  console.log(`Created ${experience9.name} with 2 slots.`);
  console.log(`Created ${experience10.name} with 2 slots.`);

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
