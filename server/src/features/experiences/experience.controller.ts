import type { Request, Response } from "express";
import { prisma } from "../../db.js";
import { serverCache } from "../../utils/cache.js";

// GET /experiences
export const getAllExperiences = async (req: Request, res: Response) => {
  try {
    const cacheKey = "all_experiences";

    // Check cache first
    const cachedExperiences = serverCache.get(cacheKey);
    if (cachedExperiences) {
      console.log("Returning experiences from server cache");
      return res.json(cachedExperiences);
    }

    // If not in cache, fetch from database
    console.log("Fetching experiences from database");
    const experiences = await prisma.experience.findMany();

    // Cache for 10 minutes
    serverCache.set(cacheKey, experiences, 10 * 60 * 1000);

    res.json(experiences);
  } catch (error) {
    console.error("Error fetching experiences:", error);
    res.status(500).json({ message: "Error fetching experiences." });
  }
};

// GET /experiences/:id
export const getExperienceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Missing id parameter" });
    }

    const cacheKey = `experience_${id}`;

    // Check cache first
    const cachedExperience = serverCache.get(cacheKey);
    if (cachedExperience) {
      console.log(`Returning experience ${id} from server cache`);
      return res.json(cachedExperience);
    }

    // If not in cache, fetch from database
    console.log(`Fetching experience ${id} from database`);
    const experience = await prisma.experience.findUnique({
      where: { id },
      include: {
        slots: true, // Automatically "joins" the slots table
      },
    });

    if (!experience) {
      return res.status(404).json({ message: "Experience not found" });
    }

    // Cache for 15 minutes
    serverCache.set(cacheKey, experience, 15 * 60 * 1000);

    res.json(experience);
  } catch (error) {
    console.error("Error fetching experience:", error);
    res.status(500).json({ message: "Error fetching experience." });
  }
};
