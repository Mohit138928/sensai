"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath } from "next/cache";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function generateConnectionMessage({
  targetName,
  targetTitle,
  targetCompany,
  context,
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: { industryInsight: true },
  });

  if (!user) throw new Error("User not found");

  const prompt = `
    Generate a LinkedIn connection request message from a ${
      user.industry
    } professional with ${user.experience} years of experience.
    
    Sender's Details:
    - Industry: ${user.industry}
    - Skills: ${user.skills?.join(", ")}
    
    Recipient's Details:
    - Name: ${targetName}
    - Title: ${targetTitle}
    - Company: ${targetCompany}
    ${context ? `- Context: ${context}` : ""}
    
    Requirements:
    1. Keep it under 300 characters (LinkedIn limit)
    2. Be professional and personalized
    3. Find common ground or mutual benefit
    4. Include a specific reason for connecting
    5. No generic messages
    
    Return only the message text, no additional formatting.
  `;

  try {
    const result = await model.generateContent(prompt);
    const message = result.response.text().trim();

    const savedMessage = await db.networkingMessage.create({
      data: {
        userId: user.id,
        messageType: "connection_request",
        content: message,
        context: { targetName, targetTitle, targetCompany, context },
      },
    });

    return savedMessage;
  } catch (error) {
    console.error("Error generating connection message:", error);
    throw new Error("Failed to generate connection message");
  }
}

export async function generateFollowUpMessage({
  contactName,
  lastInteraction,
  purpose,
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: { industryInsight: true },
  });

  if (!user) throw new Error("User not found");

  const prompt = `
    Generate a professional follow-up message for a ${user.industry} professional.
    
    Context:
    - Contact Name: ${contactName}
    - Last Interaction: ${lastInteraction}
    - Purpose: ${purpose}
    - Sender's Industry: ${user.industry}
    
    Requirements:
    1. Keep it concise and professional
    2. Reference the previous interaction
    3. Clear call-to-action
    4. Maintain relationship-building tone
    5. No generic messaging
    
    Return only the message text, no additional formatting.
  `;

  try {
    const result = await model.generateContent(prompt);
    const message = result.response.text().trim();

    const savedMessage = await db.networkingMessage.create({
      data: {
        userId: user.id,
        messageType: "follow_up",
        content: message,
        context: { contactName, lastInteraction, purpose },
      },
    });

    revalidatePath("/networking");
    return savedMessage;
  } catch (error) {
    console.error("Error generating follow-up message:", error);
    throw new Error("Failed to generate follow-up message");
  }
}

export async function suggestConnections() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: { industryInsight: true },
  });

  if (!user) throw new Error("User not found");

  const prompt = `
    Suggest 5 types of professionals a ${
      user.industry
    } professional should connect with.
    
    Consider:
    - Industry: ${user.industry}
    - Experience Level: ${user.experience} years
    - Career Skills: ${user.skills?.join(", ")}
    
    Return in this JSON format:
    {
      "suggestions": [
        {
          "role": "string",
          "reason": "string",
          "searchKeywords": ["string"],
          "commonInterests": ["string"]
        }
      ]
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    const cleanedText = text.replace(/```json\n?|\n?```/g, "").trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Error generating connection suggestions:", error);
    throw new Error("Failed to generate suggestions");
  }
}

export async function findIndustryEvents({ location, timeframe }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: { industryInsight: true },
  });

  if (!user) throw new Error("User not found");

  const prompt = `
    Suggest relevant professional events and conferences for a ${user.industry} professional.
    
    Context:
    - Industry: ${user.industry}
    - Location: ${location || 'Global/Remote'}
    - Timeframe: ${timeframe || 'Next 3 months'}
    - Professional Level: ${user.experience} years of experience
    
    Return the response in this JSON format only:
    {
      "events": [
        {
          "name": "Event Name",
          "date": "Event Date",
          "location": "City, Country or Virtual",
          "description": "Brief event description",
          "attendees": "Expected number of attendees",
          "url": "Registration/Info URL",
          "type": "Conference/Networking/Workshop",
          "price": "Price range or Free",
          "keyTopics": ["topic1", "topic2"]
        }
      ]
    }

    IMPORTANT: Return ONLY the JSON. No additional text or markdown.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    const cleanedText = text.replace(/```json\n?|\n?```/g, "").trim();
    
    // Parse and validate the JSON response
    const data = JSON.parse(cleanedText);
    
    // Store the event suggestions in the database
    await db.networkingMessage.create({
      data: {
        userId: user.id,
        messageType: "event_suggestions",
        content: "Event suggestions generated",
        context: data
      }
    });

    revalidatePath("/networking");
    return data.events;
  } catch (error) {
    console.error("Error finding industry events:", error);
    throw new Error("Failed to find industry events");
  }
}
