"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath } from "next/cache";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function generateCareerRoadmap() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      include: { industryInsight: true },
    });

    if (!user) throw new Error("User not found");

    const prompt = `
      Create a 5-year career progression plan for a ${
        user.industry
      } professional with ${user.experience} years of experience.
      Current skills: ${user.skills?.join(", ")}
      
      Return a JSON object with an array of 5 years, where each year includes:
      {
        "timeline": [
          {
            "year": 1,
            "role": "Current Role Title",
            "salaryRange": {
              "min": 50000,
              "max": 70000
            },
            "skillsToAcquire": ["Skill 1", "Skill 2", "Skill 3"],
            "certifications": [
              {
                "name": "Certification Name",
                "provider": "Provider Name",
                "url": "https://example.com"
              }
            ],
            "milestones": ["Milestone 1", "Milestone 2"]
          }
        ]
      }`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    const cleanedText = text.replace(/```json\n?|\n?```/g, "").trim();
    const data = JSON.parse(cleanedText);

    // Store the roadmap
    const roadmap = await db.careerRoadmap.create({
      data: {
        userId: user.id,
        timeline: data.timeline, // Store the timeline array directly
      },
    });

    revalidatePath("/roadmap");
    return roadmap;
  } catch (error) {
    console.error("Roadmap generation error:", error);
    throw new Error("Failed to generate career roadmap");
  }
}

export async function getRoadmap() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    const roadmap = await db.careerRoadmap.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return roadmap;
  } catch (error) {
    console.error("Error fetching roadmap:", error);
    throw new Error("Failed to fetch roadmap");
  }
}
