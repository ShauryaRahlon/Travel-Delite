import type { Request, Response } from "express";
import { prisma } from "../../db.js";

// GET /experiences
export const getAllExperiences = async (req: Request, res: Response) => {
  const experiences = await prisma.experience.findMany();
  res.json(experiences);
};

// GET /experiences/:id
export const getExperienceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Missing id parameter" });
    }

    const experience = await prisma.experience.findUnique({
      where: { id },
      include: {
        slots: true, // Automatically "joins" the slots table
      },
    });

    if (!experience) {
      return res.status(404).json({ message: "Experience not found" });
    }
    res.json(experience);
  } catch (error) {
    res.status(500).json({ message: "Error fetching experience." });
  }
};
