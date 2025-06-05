"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath } from "next/cache";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function optimizeLinkedInProfile({ profileData }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: { industryInsight: true },
  });

  if (!user) throw new Error("User not found");

  const prompt = `
    Analyze and optimize this LinkedIn profile content for a ${
      user.industry
    } professional with ${user.experience} years of experience.
    
    Current Profile Content:
    - Headline: ${profileData.headline}
    - About Section: ${profileData.about}
    - Recent Experience: ${profileData.experience || "Not provided"}
    - Skills: ${profileData.skills || "Not provided"}
    
    Background:
    - Industry: ${user.industry}
    - Experience: ${user.experience} years
    - Skills: ${user.skills?.join(", ")}
    
    Return in this exact JSON format:
    {
      "headline": {
        "current": "Current headline provided",
        "suggested": "Improved headline suggestion",
        "reasoning": "Explanation for the suggestion"
      },
      "summary": {
        "feedback": "Analysis of current summary/about section",
        "improvements": ["Specific improvement suggestion 1", "Suggestion 2"]
      },
      "experienceOptimizations": [
        {
          "role": "Job Title",
          "suggestions": ["Improvement 1", "Improvement 2"]
        }
      ],
      "skillsToAdd": ["Skill 1", "Skill 2"],
      "recommendedKeywords": ["Keyword 1", "Keyword 2"],
      "profileCompletionTips": ["Tip 1", "Tip 2"]
    }

    Focus on:
    1. Industry-specific keywords and phrases
    2. Achievement-focused language
    3. Modern LinkedIn best practices
    4. SEO optimization
    5. Engagement-driving content
    
    IMPORTANT: Return ONLY the JSON with no additional text or formatting.
  `;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleanedText = text.replace(/```json\n?|\n?```/g, "").trim();
    const data = JSON.parse(cleanedText);

    await db.personalBrand.upsert({
      where: { userId: user.id },
      update: {
        linkedInProfile: data,
      },
      create: {
        userId: user.id,
        linkedInProfile: data,
      },
    });

    return data;
  } catch (error) {
    console.error("LinkedIn optimization error:", error);
    throw new Error("Failed to optimize LinkedIn profile");
  }
}

export async function generateWebsite(formData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: { industryInsight: true },
  });

  if (!user) throw new Error("User not found");

  const prompt = `
    Generate professional website content for a ${user.industry} professional.
    
    Website Details:
    - Type: ${formData.websiteType}
    - Target Audience: ${formData.targetAudience}
    - Skills: ${formData.skills}
    - Portfolio: ${formData.portfolio}
    - Social Links: ${formData.socialLinks}
    - Image Preferences: ${formData.imagePreferences}
    - Color Preferences: ${formData.colorPreferences}
    
    Return in this JSON format:
    {
      "hero": {
        "headline": "string",
        "subheadline": "string"
      },
      "about": {
        "content": "string",
        "keyPoints": ["string"]
      },
      "portfolio": {
        "projects": [
          {
            "title": "string",
            "description": "string",
            "tags": ["string"]
          }
        ]
      },
      "design": {
        "colors": {
          "primary": "string (hex)",
          "secondary": "string (hex)",
          "accent": "string (hex)",
          "background": "string (hex)",
          "text": "string (hex)"
        },
        "images": ["string (image description/recommendation)"],
        "layout": ["string (layout suggestions)"]
      }
    }

    IMPORTANT: 
    1. Return ONLY valid JSON
    2. Make content engaging and professional
    3. Align with industry standards
    4. Include specific, actionable design recommendations
  `;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleanedText = text.replace(/```json\n?|\n?```/g, "").trim();
    const data = JSON.parse(cleanedText);

    await db.personalBrand.upsert({
      where: { userId: user.id },
      update: { personalWebsite: data },
      create: {
        userId: user.id,
        personalWebsite: data,
      },
    });

    return data;
  } catch (error) {
    console.error("Website generation error:", error);
    throw new Error("Failed to generate website content");
  }
}

export async function generateContentIdeas() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: { industryInsight: true },
  });

  if (!user) throw new Error("User not found");

  const prompt = `
    Generate content ideas for a ${user.industry} professional with ${
    user.experience
  } years of experience.
    Create a content plan that establishes thought leadership.
    
    Skills and expertise: ${user.skills?.join(", ")}
    
    Return in this JSON format:
    {
      "topics": [
        {
          "title": "string",
          "description": "string",
          "tags": ["string"],
          "contentType": "Article" | "LinkedIn Post" | "Video" | "Infographic"
        }
      ],
      "calendar": [
        {
          "week": "Week 1",
          "topic": "string",
          "format": "string",
          "keyPoints": ["string"]
        }
      ]
    }

    IMPORTANT: Return ONLY the JSON. No additional text or markdown formatting.
  `;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleanedText = text.replace(/```json\n?|\n?```/g, "").trim();
    const data = JSON.parse(cleanedText);

    // Store in database
    await db.personalBrand.upsert({
      where: { userId: user.id },
      update: { contentStrategy: data },
      create: {
        userId: user.id,
        contentStrategy: data,
      },
    });

    return data;
  } catch (error) {
    console.error("Error generating content ideas:", error);
    throw new Error("Failed to generate content ideas");
  }
}

export async function createSocialMediaStrategy() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: { industryInsight: true },
  });

  if (!user) throw new Error("User not found");

  const prompt = `
    Create a social media strategy for a ${user.industry} professional with ${
    user.experience
  } years of experience.
    
    Background:
    - Industry: ${user.industry}
    - Experience: ${user.experience} years
    - Skills: ${user.skills?.join(", ")}
    
    Return in this JSON format:
    {
      "platforms": {
        "LinkedIn": {
          "focus": "string",
          "contentMix": ["string"],
          "postingSchedule": "string",
          "metrics": ["string"],
          "engagementTips": ["string"]
        },
        "Twitter": {
          "focus": "string",
          "contentMix": ["string"],
          "postingSchedule": "string",
          "metrics": ["string"],
          "engagementTips": ["string"]
        },
        "Other": {
          "focus": "string",
          "contentMix": ["string"],
          "postingSchedule": "string",
          "metrics": ["string"],
          "engagementTips": ["string"]
        }
      }
    }

    IMPORTANT: Return ONLY the JSON. No additional text or markdown formatting.
  `;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleanedText = text.replace(/```json\n?|\n?```/g, "").trim();
    const data = JSON.parse(cleanedText);

    // Store in database
    await db.personalBrand.upsert({
      where: { userId: user.id },
      update: { socialMedia: data },
      create: {
        userId: user.id,
        socialMedia: data,
      },
    });

    return data;
  } catch (error) {
    console.error("Error creating social media strategy:", error);
    throw new Error("Failed to create social media strategy");
  }
}

// export async function generateProfessionalBio(formData) {
//   try {
//     const { userId } = await auth();
//     if (!userId) throw new Error("Unauthorized");

//     const user = await db.user.findUnique({
//       where: { clerkUserId: userId },
//       include: { industryInsight: true },
//     });

//     if (!user) throw new Error("User not found");

//     const prompt = `
//       Generate three versions of a professional bio based on the following information:
      
//       Professional Background:
//       - Current Role: ${formData.currentRole}
//       - Years of Experience: ${formData.yearsOfExperience}
//       - Key Achievements: ${formData.keyAchievements}
//       - Skills & Expertise: ${formData.skillsExpertise}
//       - Certifications: ${formData.certifications || "None"}
//       - Industry: ${user.industry}
      
//       Generate three versions:
//       1. Short (50-75 words) - For social media profiles
//       2. Medium (100-150 words) - For website/portfolio
//       3. Long (200-250 words) - For speaking engagements/detailed profiles
      
//       Return in this JSON format:
//       {
//         "short": {
//           "content": "string",
//           "wordCount": number,
//           "platforms": ["LinkedIn", "Twitter", etc]
//         },
//         "medium": {
//           "content": "string",
//           "wordCount": number,
//           "platforms": ["Personal Website", "Company Bio", etc]
//         },
//         "long": {
//           "content": "string",
//           "wordCount": number,
//           "platforms": ["Speaking Engagements", "Detailed Profiles", etc]
//         }
//       }

//       Requirements:
//       1. Write in third person
//       2. Include specific achievements
//       3. Highlight industry expertise
//       4. Use professional tone
//       5. Include relevant credentials
      
//       IMPORTANT: Return ONLY valid JSON with no additional text or markdown.
//     `;

//     const result = await model.generateContent({
//       contents: [
//         {
//           role: "user",
//           parts: [{ text: prompt }],
//         },
//       ],
//     });
//     if (!result?.response) {
//       throw new Error("Failed to generate content");
//     }

//     const text = result.response.text();
//     if (!text) {
//       throw new Error("Empty response received");
//     }

//     const cleanedText = text.replace(/```json\n?|\n?```/g, "").trim();

//     // Parse and validate the response
//     const data = JSON.parse(cleanedText);

//     // Validate response structure
//     if (!data.short || !data.medium || !data.long) {
//       throw new Error("Invalid response structure");
//     }

//     // Store in database
//     await db.personalBrand.upsert({
//       where: { userId: user.id },
//       update: { professionalBio: data },
//       create: {
//         userId: user.id,
//         professionalBio: data,
//       },
//     });

//     revalidatePath("/personal-brand");
//     return data;
//   } catch (error) {
//     console.error("Error generating professional bio:", error);
//     throw new Error("Failed to generate professional bio");
//   }
// }
