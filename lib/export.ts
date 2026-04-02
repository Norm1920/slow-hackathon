import type { AdVariation } from "./types"

function escapeCSV(str: string): string {
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

function getPlatformLabel(platform: string): string {
  const labels: Record<string, string> = {
    meta_feed: "Meta / Facebook Feed",
    instagram_stories_reels: "Instagram Stories / Reels",
    tiktok: "TikTok",
    google_display: "Google Display",
    general: "General / Multi-purpose",
  }
  return labels[platform] || platform
}

export function variationsToCSV(variations: AdVariation[]): string {
  const headers = [
    "Platform",
    "Headline / Hook",
    "Primary Text / Script",
    "Description / Overlay",
    "CTA",
    "Creative Direction",
    "Uses VOC",
    "VOC Phrase",
  ]

  const rows = variations.map((v) => {
    let headline = ""
    let primaryText = ""
    let description = ""
    let cta = ""

    switch (v.platform) {
      case "meta_feed":
        headline = v.headline
        primaryText = v.primary_text_full
        description = v.description
        cta = v.cta
        break
      case "instagram_stories_reels":
        headline = v.hook_line
        primaryText = v.script
        description = v.text_overlay_suggestions
        cta = v.cta_overlay_text
        break
      case "tiktok":
        headline = v.hook
        primaryText = v.script
        description = v.text_overlay
        cta = v.cta
        break
      case "google_display":
        headline = `${v.headline} | ${v.long_headline}`
        primaryText = v.description
        description = ""
        cta = v.cta
        break
      case "general":
        headline = v.tagline
        primaryText = `${v.value_proposition} ${v.elevator_pitch}`
        description = v.email_subject_line
        cta = ""
        break
    }

    return [
      getPlatformLabel(v.platform),
      headline,
      primaryText,
      description,
      cta,
      v.creative_direction,
      v.uses_voc ? "Yes" : "No",
      v.voc_phrase || "",
    ].map(escapeCSV)
  })

  return [headers.map(escapeCSV).join(","), ...rows.map((r) => r.join(","))].join(
    "\n"
  )
}

export function variationsToText(variations: AdVariation[]): string {
  const sections: string[] = []

  const grouped = variations.reduce(
    (acc, v) => {
      if (!acc[v.platform]) acc[v.platform] = []
      acc[v.platform].push(v)
      return acc
    },
    {} as Record<string, AdVariation[]>
  )

  for (const [platform, vars] of Object.entries(grouped)) {
    sections.push(`\n${"=".repeat(60)}`)
    sections.push(getPlatformLabel(platform).toUpperCase())
    sections.push("=".repeat(60))

    vars.forEach((v, i) => {
      sections.push(`\n--- Variation ${i + 1} ${v.uses_voc ? "[VOC]" : ""} ---`)

      switch (v.platform) {
        case "meta_feed":
          sections.push(`Headline: ${v.headline}`)
          sections.push(`Primary Text (short): ${v.primary_text_short}`)
          sections.push(`Primary Text (full): ${v.primary_text_full}`)
          sections.push(`Description: ${v.description}`)
          sections.push(`CTA: ${v.cta}`)
          break
        case "instagram_stories_reels":
          sections.push(`Hook: ${v.hook_line}`)
          sections.push(`Script: ${v.script}`)
          sections.push(`Text Overlays: ${v.text_overlay_suggestions}`)
          sections.push(`CTA Overlay: ${v.cta_overlay_text}`)
          sections.push(`Hashtags: ${v.hashtags}`)
          break
        case "tiktok":
          sections.push(`Hook: ${v.hook}`)
          sections.push(`Script: ${v.script}`)
          sections.push(`Text Overlay: ${v.text_overlay}`)
          sections.push(`Sound/Music: ${v.sound_music_direction}`)
          sections.push(`CTA: ${v.cta}`)
          break
        case "google_display":
          sections.push(`Headline: ${v.headline}`)
          sections.push(`Long Headline: ${v.long_headline}`)
          sections.push(`Description: ${v.description}`)
          sections.push(`CTA: ${v.cta}`)
          break
        case "general":
          sections.push(`Tagline: ${v.tagline}`)
          sections.push(`Value Prop: ${v.value_proposition}`)
          sections.push(`Elevator Pitch: ${v.elevator_pitch}`)
          sections.push(`Email Subject: ${v.email_subject_line}`)
          break
      }

      sections.push(`Creative Direction: ${v.creative_direction}`)
      if (v.uses_voc && v.voc_phrase) {
        sections.push(`VOC Phrase: ${v.voc_phrase}`)
      }
    })
  }

  return sections.join("\n")
}
