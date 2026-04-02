import { generateAdCreative } from "@/lib/claude"
import type { GenerateRequest } from "@/lib/types"
import { NextRequest, NextResponse } from "next/server"

export const maxDuration = 60 // Allow up to 60 seconds for Claude vision calls

export async function POST(req: NextRequest) {
  try {
    if (!process.env.CLAUDE_API_KEY) {
      return NextResponse.json(
        { error: "CLAUDE_API_KEY is not configured. Add it to your .env file." },
        { status: 500 }
      )
    }

    const body = (await req.json()) as GenerateRequest

    // Validate required fields
    if (!body.imageBase64 || !body.imageMediaType) {
      return NextResponse.json(
        { error: "Image is required" },
        { status: 400 }
      )
    }
    if (!body.audience) {
      return NextResponse.json(
        { error: "Audience selection is required" },
        { status: 400 }
      )
    }
    if (!body.angle) {
      return NextResponse.json(
        { error: "Messaging angle is required" },
        { status: 400 }
      )
    }
    if (!body.platforms || body.platforms.length === 0) {
      return NextResponse.json(
        { error: "At least one platform must be selected" },
        { status: 400 }
      )
    }

    const variations = await generateAdCreative(body)

    return NextResponse.json({ variations })
  } catch (error) {
    console.error("Generation error:", error)

    const message =
      error instanceof Error ? error.message : "Unknown error occurred"

    return NextResponse.json({ error: message }, { status: 500 })
  }
}
