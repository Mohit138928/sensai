"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath } from "next/cache";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function startNegotiation(role) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: { industryInsight: true },
  });

  if (!user) throw new Error("User not found");

  // Generate initial offer based on industry data
  const baseOffer = await generateInitialOffer(user.industry, role);

  const simulation = await db.negotiationSimulation.create({
    data: {
      userId: user.id,
      role,
      baseOffer,
      messages: [
        {
          role: "recruiter",
          content: `I'm pleased to offer you the ${role} position with a starting salary of $${baseOffer.toLocaleString()} per year. What are your thoughts on this offer?`,
        },
      ],
    },
  });

  return simulation;
}

export async function sendMessage(simulationId, message) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const simulation = await db.negotiationSimulation.findUnique({
    where: { id: simulationId },
    include: { user: true },
  });

  if (!simulation) throw new Error("Simulation not found");

  // Generate AI response and feedback
  const response = await generateNegotiationResponse(simulation, message);

  // Update simulation with new message
  const updatedSimulation = await db.negotiationSimulation.update({
    where: { id: simulationId },
    data: {
      messages: [
        ...simulation.messages,
        { role: "candidate", content: message },
        { role: "recruiter", content: response.message },
      ],
      feedback: response.feedback,
      ...(response.finalOffer && {
        finalOffer: response.finalOffer,
        status: "completed",
      }),
    },
  });

  revalidatePath("/negotiation");
  return updatedSimulation;
}

async function generateInitialOffer(industry, role) {
  const prompt = `
    Generate a realistic initial salary offer for a ${role} position in the ${industry} industry.
    Consider current market rates and industry standards.
    Return only the number without any additional text or formatting.
  `;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();
  return parseFloat(text);
}

async function generateNegotiationResponse(simulation, userMessage) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: { industryInsight: true },
  });

  if (!user) throw new Error("User not found");

  const prompt = `
    Act as a hiring manager negotiating a job offer.
    
    Context:
    - Candidate Name: ${user.name}
    - Role: ${simulation.role}
    - Current Offer: $${simulation.baseOffer}
    - Industry: ${user.industry}
    - Conversation History: ${JSON.stringify(simulation.messages)}
    
    Candidate's Message: "${userMessage}"
    
    Analyze the candidate's negotiation approach and provide:
    1. A realistic response as the hiring manager
    2. Constructive feedback on their negotiation tactics
    3. If appropriate, a new offer amount
    
    IMPORTANT: Use the candidate's actual name (${
      user.name
    }) in your response, not placeholders.
    
    Return in this JSON format:
    {
      "message": "hiring manager's response",
      "feedback": "feedback on negotiation tactics",
      "finalOffer": number or null
    }

    IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    // Clean the response text by removing any markdown code block indicators
    const cleanedText = text.replace(/```json\n?|\n?```/g, "").trim();

    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Error generating negotiation response:", error);
    throw new Error("Failed to generate negotiation response");
  }
}

export async function analyzeBenefitsPackage(benefits) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const prompt = `
    Analyze this benefits package and provide insights:
    ${JSON.stringify(benefits)}
    
    Return in this JSON format:
    {
      "analysis": {
        "strengths": ["string"],
        "weaknesses": ["string"],
        "monetaryValue": number,
        "industryComparison": "Above Average" | "Average" | "Below Average",
        "negotiationTips": ["string"]
      }
    }
  `;

  const result = await model.generateContent(prompt);
  const analysis = JSON.parse(result.response.text().trim());
  return analysis;
}
