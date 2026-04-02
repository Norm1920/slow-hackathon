"use client"

import { useState, useCallback } from "react"
import { Copy, Check, ImageIcon, Download } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import type { AdVariation } from "@/lib/types"

interface AdCardProps {
  variation: AdVariation
  index: number
  showImageButton?: boolean
  productImageBase64?: string | null
  productImageMediaType?: string | null
}

function getPlatformLabel(platform: string): string {
  const labels: Record<string, string> = {
    meta_feed: "Meta / Facebook",
    instagram_stories_reels: "Instagram",
    tiktok: "TikTok",
    google_display: "Google Display",
    general: "General",
  }
  return labels[platform] || platform
}

function getCardText(v: AdVariation): string {
  switch (v.platform) {
    case "meta_feed":
      return [
        `Headline: ${v.headline}`,
        `Primary Text (short): ${v.primary_text_short}`,
        `Primary Text (full): ${v.primary_text_full}`,
        `Description: ${v.description}`,
        `CTA: ${v.cta}`,
        `Creative Direction: ${v.creative_direction}`,
      ].join("\n")
    case "instagram_stories_reels":
      return [
        `Hook: ${v.hook_line}`,
        `Script: ${v.script}`,
        `Text Overlays: ${v.text_overlay_suggestions}`,
        `CTA Overlay: ${v.cta_overlay_text}`,
        `Hashtags: ${v.hashtags}`,
        `Creative Direction: ${v.creative_direction}`,
      ].join("\n")
    case "tiktok":
      return [
        `Hook: ${v.hook}`,
        `Script: ${v.script}`,
        `Text Overlay: ${v.text_overlay}`,
        `Sound/Music: ${v.sound_music_direction}`,
        `CTA: ${v.cta}`,
        `Creative Direction: ${v.creative_direction}`,
      ].join("\n")
    case "google_display":
      return [
        `Headline: ${v.headline}`,
        `Long Headline: ${v.long_headline}`,
        `Description: ${v.description}`,
        `CTA: ${v.cta}`,
        `Creative Direction: ${v.creative_direction}`,
      ].join("\n")
    case "general":
      return [
        `Tagline: ${v.tagline}`,
        `Value Proposition: ${v.value_proposition}`,
        `Elevator Pitch: ${v.elevator_pitch}`,
        `Email Subject: ${v.email_subject_line}`,
        `Creative Direction: ${v.creative_direction}`,
      ].join("\n")
    default:
      return ""
  }
}

// Get the headline/hook text for overlay
function getOverlayText(v: AdVariation): { headline: string; cta: string } {
  switch (v.platform) {
    case "meta_feed":
      return { headline: v.headline, cta: v.cta }
    case "instagram_stories_reels":
      return { headline: v.hook_line, cta: v.cta_overlay_text }
    case "tiktok":
      return { headline: v.hook, cta: v.cta }
    case "google_display":
      return { headline: v.headline, cta: v.cta }
    case "general":
      return { headline: v.tagline, cta: "" }
    default:
      return { headline: "", cta: "" }
  }
}

// Canvas-based text overlay on the product image
function createOverlayImage(
  imageSrc: string,
  headline: string,
  cta: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement("canvas")
      // Use 1080x1080 square for social media
      const size = 1080
      canvas.width = size
      canvas.height = size
      const ctx = canvas.getContext("2d")
      if (!ctx) return reject(new Error("Canvas not supported"))

      // Draw product image scaled to fill the square
      const scale = Math.max(size / img.width, size / img.height)
      const w = img.width * scale
      const h = img.height * scale
      const x = (size - w) / 2
      const y = (size - h) / 2
      ctx.drawImage(img, x, y, w, h)

      // Dark gradient overlay at top and bottom for text readability
      const topGrad = ctx.createLinearGradient(0, 0, 0, size * 0.35)
      topGrad.addColorStop(0, "rgba(0, 0, 0, 0.7)")
      topGrad.addColorStop(1, "rgba(0, 0, 0, 0)")
      ctx.fillStyle = topGrad
      ctx.fillRect(0, 0, size, size * 0.35)

      const botGrad = ctx.createLinearGradient(0, size * 0.7, 0, size)
      botGrad.addColorStop(0, "rgba(0, 0, 0, 0)")
      botGrad.addColorStop(1, "rgba(0, 0, 0, 0.75)")
      ctx.fillStyle = botGrad
      ctx.fillRect(0, size * 0.7, size, size * 0.3)

      // Draw headline at the top
      ctx.textAlign = "center"
      ctx.fillStyle = "#FFFFFF"
      ctx.shadowColor = "rgba(0, 0, 0, 0.5)"
      ctx.shadowBlur = 8
      ctx.shadowOffsetX = 2
      ctx.shadowOffsetY = 2

      // Auto-size font to fit width
      let fontSize = 64
      ctx.font = `bold ${fontSize}px sans-serif`
      while (ctx.measureText(headline).width > size * 0.85 && fontSize > 24) {
        fontSize -= 2
        ctx.font = `bold ${fontSize}px sans-serif`
      }

      // Word wrap if still too long
      const words = headline.split(" ")
      const lines: string[] = []
      let currentLine = ""
      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word
        if (ctx.measureText(testLine).width > size * 0.85) {
          if (currentLine) lines.push(currentLine)
          currentLine = word
        } else {
          currentLine = testLine
        }
      }
      if (currentLine) lines.push(currentLine)

      // Draw each line
      const lineHeight = fontSize * 1.2
      const startY = 60 + lineHeight
      lines.forEach((line, i) => {
        ctx.fillText(line, size / 2, startY + i * lineHeight)
      })

      // Draw CTA button at the bottom
      if (cta) {
        ctx.shadowBlur = 0
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 0

        const ctaFontSize = 28
        ctx.font = `bold ${ctaFontSize}px sans-serif`
        const ctaWidth = ctx.measureText(cta).width + 60
        const ctaHeight = 52
        const ctaX = (size - ctaWidth) / 2
        const ctaY = size - 80 - ctaHeight

        // Button background
        ctx.fillStyle = "#FFFFFF"
        ctx.beginPath()
        ctx.roundRect(ctaX, ctaY, ctaWidth, ctaHeight, 8)
        ctx.fill()

        // Button text
        ctx.fillStyle = "#000000"
        ctx.textAlign = "center"
        ctx.fillText(cta, size / 2, ctaY + ctaHeight / 2 + ctaFontSize / 3)
      }

      resolve(canvas.toDataURL("image/png"))
    }
    img.onerror = () => reject(new Error("Failed to load image"))
    img.src = imageSrc
  })
}

function FieldRow({ label, value }: { label: string; value: string }) {
  if (!value) return null
  return (
    <div className="space-y-0.5">
      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </div>
      <div className="text-sm whitespace-pre-wrap">{value}</div>
    </div>
  )
}

export function AdCard({ variation, index, showImageButton = false, productImageBase64, productImageMediaType }: AdCardProps) {
  const [copied, setCopied] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(getCardText(variation))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCreateOverlay = useCallback(async () => {
    if (!productImageBase64 || !productImageMediaType) return

    const imageSrc = `data:${productImageMediaType};base64,${productImageBase64}`
    const { headline, cta } = getOverlayText(variation)

    try {
      const result = await createOverlayImage(imageSrc, headline, cta)
      setGeneratedImage(result)
    } catch {
      // Silently fail — button just won't produce an image
    }
  }, [productImageBase64, productImageMediaType, variation])

  const handleDownloadImage = () => {
    if (!generatedImage) return
    const link = document.createElement("a")
    link.href = generatedImage
    link.download = `tektones-ad-${variation.platform}-${index + 1}.png`
    link.click()
  }

  return (
    <Card className="group relative">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-muted-foreground">
              #{index + 1}
            </span>
            <Badge variant="secondary" className="text-xs">
              {getPlatformLabel(variation.platform)}
            </Badge>
            {variation.uses_voc && (
              <Badge className="text-xs bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/20">
                VOC
              </Badge>
            )}
          </div>
          <button
            onClick={handleCopy}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md hover:bg-muted"
            title="Copy to clipboard"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Generated Overlay Image */}
        {generatedImage && (
          <div className="relative rounded-lg overflow-hidden border border-border">
            <img
              src={generatedImage}
              alt="Ad with text overlay"
              className="w-full object-cover"
            />
            <button
              onClick={handleDownloadImage}
              className="absolute top-2 right-2 rounded-full bg-background/80 backdrop-blur-sm p-1.5 hover:bg-background transition-colors border border-border"
              title="Download image"
            >
              <Download className="h-4 w-4" />
            </button>
          </div>
        )}

        {variation.platform === "meta_feed" && (
          <>
            <FieldRow label="Headline" value={variation.headline} />
            <FieldRow label="Primary Text (short)" value={variation.primary_text_short} />
            <FieldRow label="Primary Text (full)" value={variation.primary_text_full} />
            <FieldRow label="Description" value={variation.description} />
            <FieldRow label="CTA" value={variation.cta} />
          </>
        )}

        {variation.platform === "instagram_stories_reels" && (
          <>
            <FieldRow label="Hook" value={variation.hook_line} />
            <FieldRow label="Script" value={variation.script} />
            <FieldRow label="Text Overlays" value={variation.text_overlay_suggestions} />
            <FieldRow label="CTA Overlay" value={variation.cta_overlay_text} />
            <FieldRow label="Hashtags" value={variation.hashtags} />
          </>
        )}

        {variation.platform === "tiktok" && (
          <>
            <FieldRow label="Hook" value={variation.hook} />
            <FieldRow label="Script" value={variation.script} />
            <FieldRow label="Text Overlay" value={variation.text_overlay} />
            <FieldRow label="Sound / Music" value={variation.sound_music_direction} />
            <FieldRow label="CTA" value={variation.cta} />
          </>
        )}

        {variation.platform === "google_display" && (
          <>
            <FieldRow label="Headline" value={variation.headline} />
            <FieldRow label="Long Headline" value={variation.long_headline} />
            <FieldRow label="Description" value={variation.description} />
            <FieldRow label="CTA" value={variation.cta} />
          </>
        )}

        {variation.platform === "general" && (
          <>
            <FieldRow label="Tagline" value={variation.tagline} />
            <FieldRow label="Value Proposition" value={variation.value_proposition} />
            <FieldRow label="Elevator Pitch" value={variation.elevator_pitch} />
            <FieldRow label="Email Subject" value={variation.email_subject_line} />
          </>
        )}

        <FieldRow label="Creative Direction" value={variation.creative_direction} />

        {variation.uses_voc && variation.voc_phrase && (
          <div className="pt-1 border-t border-border">
            <span className="text-xs text-amber-600 italic">
              VOC: &ldquo;{variation.voc_phrase}&rdquo;
            </span>
          </div>
        )}

        {/* Create Overlay Button */}
        {showImageButton && productImageBase64 && (
          <div className="pt-2 border-t border-border">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCreateOverlay}
              className="w-full"
            >
              <ImageIcon className="h-3.5 w-3.5 mr-1.5" />
              {generatedImage ? "Regenerate Image" : "Create Ad Image"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Export helper for use in other components
export { getCardText }
