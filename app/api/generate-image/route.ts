import { GoogleGenAI } from "@google/genai"
import { NextRequest, NextResponse } from "next/server"

export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured. Add it to your .env file." },
        { status: 500 }
      )
    }

    const { prompt, imageBase64, imageMediaType } = (await req.json()) as {
      prompt: string
      imageBase64?: string
      imageMediaType?: string
    }

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      )
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

    // Build parts: include the user's product image if provided
    const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = []

    if (imageBase64 && imageMediaType) {
      parts.push({
        inlineData: {
          mimeType: imageMediaType,
          data: imageBase64,
        },
      })
    }

    parts.push({
      text: `Edit this photo of my product to create an advertisement image. Here is the creative direction:\n\n${prompt}\n\nCRITICAL RULES:\n- This is an IMAGE EDITING task, NOT image generation. You are editing the photo I uploaded.\n- Keep my EXACT product as-is — same shape, same colors, same details, same brick texture. Do NOT redraw, reimagine, or recreate it.\n- Only change the BACKGROUND and SURROUNDINGS — add a professional backdrop, lighting, and ad-ready composition around my unchanged product photo.\n- The final image must contain the original product photo looking exactly as it does in my upload, just placed in a better setting.\n- Make it suitable for paid social media advertising.`,
    })

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: [
        {
          role: "user",
          parts,
        },
      ],
      config: {
        responseModalities: ["TEXT", "IMAGE"],
      },
    })

    // Extract image from response
    if (response.candidates && response.candidates[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return NextResponse.json({
            imageBase64: part.inlineData.data,
            mimeType: part.inlineData.mimeType,
          })
        }
      }
    }

    return NextResponse.json(
      { error: "No image was generated. Your Gemini account may need billing enabled for image generation." },
      { status: 500 }
    )
  } catch (error) {
    console.error("Image generation error:", error)
    const message =
      error instanceof Error ? error.message : "Unknown error occurred"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
