import Anthropic from "@anthropic-ai/sdk"
import type { GenerateRequest, AdVariation } from "./types"

function buildSystemPrompt(req: GenerateRequest): string {
  // Build dynamic product details from user input
  const productLines: string[] = []
  if (req.productTitle) productLines.push(`- Product name: ${req.productTitle}`)
  if (req.pieceCount) productLines.push(`- Piece count: ${req.pieceCount}`)
  if (req.retailPrice) productLines.push(`- Retail price: ${req.retailPrice}`)
  if (req.discountPrice) productLines.push(`- Sale / presale price: ${req.discountPrice}`)
  productLines.push(`- Brand: ${req.brand}`)
  productLines.push(`- LEGO-compatible, premium brick quality`)
  productLines.push(`- Includes custom proprietary minifigures (NOT LEGO minifigures — completely original design)`)
  productLines.push(`- Target age: 8+ (but parents and adult collectors love it too)`)
  productLines.push(`- Competitive context: LEGO deliberately avoids all religious content — this is the first premium faith-based alternative`)

  return `You are an elite direct-response advertising copywriter specializing in Meta, Instagram, TikTok, and Google ads for premium consumer products. You write for a faith-based LEGO-compatible construction toy brand called ${req.brand}.

YOUR STYLE:
- You write hooks that stop the scroll in under 2 seconds
- You use the exact language your target audience uses (voice of customer)
- You balance emotional storytelling with clear product value
- You never sound preachy or churchy — faith is woven in naturally
- You create urgency without being sleazy
- You understand that parents buy this product but kids need to want it too
- You vary your formats: questions, bold claims, story leads, data leads, social proof leads

VOICE OF CUSTOMER DATA (from real customer research with Christian moms who buy construction toys):
- "I'm tired of spending hundreds on toys that teach my kids nothing about what matters"
- "I want something my kids actually ASK to play with, not just something I think is good for them"
- "Why does everything have to be Star Wars or Marvel? Where are the heroes I actually want my kids looking up to?"
- "The quality has to be there — my kids will compare it to LEGO and if it feels cheap, it's over"
- "I would pay more for something that combines faith and play without being cheesy"
- "My husband and I both grew up on LEGO — we want to build with our kids but we want it to mean something"
- "I've been waiting for something like this to exist"

PRODUCT DETAILS:
${productLines.join("\n")}

CRITICAL RULES:
- Never use the word "LEGO" in any ad copy. Say "premium building bricks" or "compatible with your existing brick collection" or "construction toy"
- Never claim this IS LEGO. It's LEGO-compatible.
- Character limits are HARD limits — do not exceed them
- Every variation must include a clear CTA
- At least 3 variations per platform should use exact voice-of-customer language (mark these with [VOC] tag)
- Generate exactly the number of variations requested per platform
- Include creative direction notes describing what the visual/video should show alongside the copy
- Use the EXACT product name, prices, and piece count provided above in your copy — do not make up numbers`
}

function buildUserMessage(req: GenerateRequest): string {
  const platformLabels: Record<string, string> = {
    meta_feed: "Meta / Facebook Feed",
    instagram_stories_reels: "Instagram Stories / Reels",
    tiktok: "TikTok",
    google_display: "Google Display",
    general: "General / Multi-purpose",
  }

  const selectedPlatforms = req.platforms
    .map((p) => platformLabels[p] || p)
    .join(", ")

  const totalIdeas = req.ideaCount || 10
  const variationsPerPlatform = Math.max(
    1,
    Math.round(totalIdeas / req.platforms.length)
  )

  return `I'm uploading a product image for you to analyze. Based on what you see in the image:

Brand Name: ${req.brand}${req.productTitle ? `\nProduct Title: ${req.productTitle}` : ""}
Target Audience: ${req.audience}
Messaging Angle: ${req.angle}

Generate ad creative for the following platforms: ${selectedPlatforms}

Generate exactly ${totalIdeas} variations total, split roughly evenly across platforms (~${variationsPerPlatform} per platform). Make sure at least 30% of variations use exact voice-of-customer language and mark those with [VOC] by setting uses_voc to true.

Analyze the uploaded product image and reference specific visual elements (colors, details, scale, character features) in your creative direction notes.

Return the output as a JSON object with this structure. IMPORTANT: Return ONLY the JSON, no markdown code blocks, no extra text.

For meta_feed platform:
{
  "variations": [
    {
      "platform": "meta_feed",
      "headline": "..." (40 char max),
      "primary_text_short": "..." (125 char max, above-fold),
      "primary_text_full": "..." (up to 500 chars),
      "description": "..." (30 char max),
      "cta": "Shop Now | Learn More | Reserve Yours | Sign Up | Get Offer",
      "creative_direction": "2-3 sentences describing what the image/video should show",
      "uses_voc": true/false,
      "voc_phrase": "..." (if uses_voc is true, the exact VOC phrase used)
    }
  ]
}

For instagram_stories_reels platform:
{
  "platform": "instagram_stories_reels",
  "hook_line": "..." (first 3 seconds — what stops the scroll),
  "script": "..." (15-30 second script with visual direction),
  "text_overlay_suggestions": "..." (what text appears on screen),
  "cta_overlay_text": "...",
  "hashtags": "..." (5-8 relevant hashtags),
  "creative_direction": "...",
  "uses_voc": true/false,
  "voc_phrase": "..."
}

For tiktok platform:
{
  "platform": "tiktok",
  "hook": "..." (first 2 seconds),
  "script": "..." (15-45 second script, conversational/authentic tone),
  "text_overlay": "...",
  "sound_music_direction": "...",
  "cta": "...",
  "creative_direction": "...",
  "uses_voc": true/false,
  "voc_phrase": "..."
}

For google_display platform:
{
  "platform": "google_display",
  "headline": "..." (30 char max),
  "long_headline": "..." (90 char max),
  "description": "..." (90 char max),
  "cta": "...",
  "creative_direction": "...",
  "uses_voc": true/false,
  "voc_phrase": "..."
}

For general platform:
{
  "platform": "general",
  "tagline": "..." (10 words or fewer),
  "value_proposition": "..." (1 sentence),
  "elevator_pitch": "..." (2-3 sentences),
  "email_subject_line": "...",
  "creative_direction": "...",
  "uses_voc": true/false,
  "voc_phrase": "..."
}

Return ALL variations in a single JSON object: { "variations": [...] }`
}

function parseClaudeResponse(text: string): AdVariation[] {
  // Strip markdown code blocks if present
  let cleaned = text.trim()

  // Remove ```json ... ``` or ``` ... ```
  const codeBlockMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (codeBlockMatch) {
    cleaned = codeBlockMatch[1].trim()
  }

  // Try parsing
  try {
    const parsed = JSON.parse(cleaned)
    if (parsed.variations && Array.isArray(parsed.variations)) {
      return parsed.variations
    }
    // Maybe it's just an array
    if (Array.isArray(parsed)) {
      return parsed
    }
    throw new Error("Unexpected JSON structure")
  } catch (firstError) {
    // Try to find JSON object in the text
    const jsonMatch = cleaned.match(/\{[\s\S]*"variations"[\s\S]*\}/)
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0])
        return parsed.variations
      } catch {
        // Fall through
      }
    }

    throw new Error(
      `Failed to parse Claude response as JSON: ${firstError instanceof Error ? firstError.message : "Unknown error"}`
    )
  }
}

export async function generateAdCreative(
  req: GenerateRequest
): Promise<AdVariation[]> {
  const client = new Anthropic({
    apiKey: process.env.CLAUDE_API_KEY,
  })

  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 8000,
    system: buildSystemPrompt(req),
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: req.imageMediaType,
              data: req.imageBase64,
            },
          },
          {
            type: "text",
            text: buildUserMessage(req),
          },
        ],
      },
    ],
  })

  // Extract text from response
  const textBlock = message.content.find((block) => block.type === "text")
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text response from Claude")
  }

  return parseClaudeResponse(textBlock.text)
}
