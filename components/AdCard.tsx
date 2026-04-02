"use client"

import { useState, useCallback } from "react"
import { Copy, Check, ImageIcon, Download, Shuffle } from "lucide-react"
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
  productTitle?: string
  retailPrice?: string
  discountPrice?: string
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

// ─── Layout styles ───────────────────────────────────────────
type LayoutStyle = "top-bottom" | "bottom-bar" | "centered" | "left-panel"

const LAYOUT_STYLES: LayoutStyle[] = ["top-bottom", "bottom-bar", "centered", "left-panel"]

const ACCENT_COLORS = [
  { bg: "rgba(30, 58, 138, 0.9)", text: "#FFFFFF", cta: "#FACC15", ctaText: "#1E3A5F" },  // navy + gold
  { bg: "rgba(0, 0, 0, 0.85)", text: "#FFFFFF", cta: "#FFFFFF", ctaText: "#000000" },      // classic black
  { bg: "rgba(120, 53, 15, 0.9)", text: "#FFFFFF", cta: "#FCD34D", ctaText: "#78350F" },   // warm brown + amber
  { bg: "rgba(15, 23, 42, 0.9)", text: "#F8FAFC", cta: "#38BDF8", ctaText: "#0F172A" },    // slate + sky
]

function wordWrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(" ")
  const lines: string[] = []
  let currentLine = ""
  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word
    if (ctx.measureText(testLine).width > maxWidth) {
      if (currentLine) lines.push(currentLine)
      currentLine = word
    } else {
      currentLine = testLine
    }
  }
  if (currentLine) lines.push(currentLine)
  return lines
}

function drawRoundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.roundRect(x, y, w, h, r)
  ctx.fill()
}

interface OverlayOptions {
  headline: string
  cta: string
  productTitle?: string
  retailPrice?: string
  discountPrice?: string
  layout: LayoutStyle
  colorIndex: number
}

function createOverlayImage(imageSrc: string, opts: OverlayOptions): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement("canvas")
      const minW = 1080
      const scale = img.width < minW ? minW / img.width : 1
      const w = Math.round(img.width * scale)
      const h = Math.round(img.height * scale)
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext("2d")
      if (!ctx) return reject(new Error("Canvas not supported"))

      const colors = ACCENT_COLORS[opts.colorIndex % ACCENT_COLORS.length]

      // Draw the full product image
      ctx.drawImage(img, 0, 0, w, h)

      const headlineFontSize = Math.round(w * 0.048)
      const subFontSize = Math.round(w * 0.028)
      const ctaFontSize = Math.round(w * 0.024)
      const pad = Math.round(w * 0.04)

      // ─── Layout: top-bottom ──────────────────────
      if (opts.layout === "top-bottom") {
        // Top gradient
        const topGrad = ctx.createLinearGradient(0, 0, 0, h * 0.35)
        topGrad.addColorStop(0, colors.bg)
        topGrad.addColorStop(1, "rgba(0,0,0,0)")
        ctx.fillStyle = topGrad
        ctx.fillRect(0, 0, w, h * 0.35)

        // Bottom gradient
        const botGrad = ctx.createLinearGradient(0, h * 0.7, 0, h)
        botGrad.addColorStop(0, "rgba(0,0,0,0)")
        botGrad.addColorStop(1, colors.bg)
        ctx.fillStyle = botGrad
        ctx.fillRect(0, h * 0.7, w, h * 0.3)

        // Headline top
        ctx.textAlign = "center"
        ctx.fillStyle = colors.text
        ctx.shadowColor = "rgba(0,0,0,0.6)"
        ctx.shadowBlur = 6
        ctx.font = `bold ${headlineFontSize}px sans-serif`
        const lines = wordWrap(ctx, opts.headline, w * 0.85)
        const lineH = headlineFontSize * 1.25
        lines.forEach((line, i) => {
          ctx.fillText(line, w / 2, pad + lineH + i * lineH)
        })

        // Product info + CTA at bottom
        ctx.shadowBlur = 0
        let bottomY = h - pad

        if (opts.cta) {
          ctx.font = `bold ${ctaFontSize}px sans-serif`
          const ctaW = ctx.measureText(opts.cta).width + 50
          const ctaH = ctaFontSize * 2.2
          ctx.fillStyle = colors.cta
          drawRoundRect(ctx, (w - ctaW) / 2, bottomY - ctaH, ctaW, ctaH, 6)
          ctx.fillStyle = colors.ctaText
          ctx.textAlign = "center"
          ctx.fillText(opts.cta, w / 2, bottomY - ctaH / 2 + ctaFontSize / 3)
          bottomY -= ctaH + pad * 0.6
        }

        if (opts.discountPrice || opts.retailPrice) {
          ctx.fillStyle = colors.text
          ctx.font = `bold ${subFontSize}px sans-serif`
          const priceText = opts.discountPrice
            ? `${opts.discountPrice}${opts.retailPrice ? ` (was ${opts.retailPrice})` : ""}`
            : opts.retailPrice || ""
          ctx.textAlign = "center"
          ctx.fillText(priceText, w / 2, bottomY)
        }
      }

      // ─── Layout: bottom-bar ──────────────────────
      if (opts.layout === "bottom-bar") {
        const barH = Math.round(h * 0.28)
        ctx.fillStyle = colors.bg
        ctx.fillRect(0, h - barH, w, barH)

        // Thin accent line
        ctx.fillStyle = colors.cta
        ctx.fillRect(0, h - barH, w, 3)

        let curY = h - barH + pad

        // Headline
        ctx.textAlign = "left"
        ctx.fillStyle = colors.text
        ctx.font = `bold ${headlineFontSize}px sans-serif`
        const lines = wordWrap(ctx, opts.headline, w - pad * 2)
        const lineH = headlineFontSize * 1.2
        lines.forEach((line, i) => {
          ctx.fillText(line, pad, curY + lineH + i * lineH)
        })
        curY += lineH * lines.length + pad * 0.5

        // Price row
        if (opts.discountPrice || opts.retailPrice) {
          ctx.font = `bold ${subFontSize}px sans-serif`
          ctx.fillStyle = colors.cta
          const priceText = opts.discountPrice || opts.retailPrice || ""
          ctx.fillText(priceText, pad, curY + subFontSize)
          if (opts.discountPrice && opts.retailPrice) {
            const priceW = ctx.measureText(priceText).width
            ctx.fillStyle = "rgba(255,255,255,0.5)"
            ctx.font = `${subFontSize * 0.85}px sans-serif`
            ctx.fillText(` ${opts.retailPrice}`, pad + priceW, curY + subFontSize)
            // Strikethrough
            const oldW = ctx.measureText(` ${opts.retailPrice}`).width
            ctx.fillStyle = "rgba(255,255,255,0.5)"
            ctx.fillRect(pad + priceW, curY + subFontSize * 0.6, oldW, 2)
          }
        }

        // CTA button right-aligned
        if (opts.cta) {
          ctx.font = `bold ${ctaFontSize}px sans-serif`
          const ctaW = ctx.measureText(opts.cta).width + 40
          const ctaH = ctaFontSize * 2
          const ctaX = w - pad - ctaW
          const ctaY = h - pad - ctaH
          ctx.fillStyle = colors.cta
          drawRoundRect(ctx, ctaX, ctaY, ctaW, ctaH, 6)
          ctx.fillStyle = colors.ctaText
          ctx.textAlign = "center"
          ctx.fillText(opts.cta, ctaX + ctaW / 2, ctaY + ctaH / 2 + ctaFontSize / 3)
        }
      }

      // ─── Layout: centered ────────────────────────
      if (opts.layout === "centered") {
        // Full dark overlay
        ctx.fillStyle = "rgba(0,0,0,0.55)"
        ctx.fillRect(0, 0, w, h)

        // Centered content box
        const boxW = w * 0.75
        const boxH = h * 0.45
        const boxX = (w - boxW) / 2
        const boxY = (h - boxH) / 2
        ctx.fillStyle = colors.bg
        drawRoundRect(ctx, boxX, boxY, boxW, boxH, 16)

        let curY = boxY + pad * 1.5

        // Product title small
        if (opts.productTitle) {
          ctx.textAlign = "center"
          ctx.fillStyle = colors.cta
          ctx.font = `600 ${subFontSize * 0.9}px sans-serif`
          ctx.fillText(opts.productTitle.toUpperCase(), w / 2, curY + subFontSize)
          curY += subFontSize + pad * 0.8
        }

        // Headline
        ctx.fillStyle = colors.text
        ctx.font = `bold ${headlineFontSize}px sans-serif`
        ctx.textAlign = "center"
        const lines = wordWrap(ctx, opts.headline, boxW - pad * 2)
        const lineH = headlineFontSize * 1.25
        lines.forEach((line, i) => {
          ctx.fillText(line, w / 2, curY + lineH + i * lineH)
        })
        curY += lineH * lines.length + pad

        // Price
        if (opts.discountPrice || opts.retailPrice) {
          ctx.font = `bold ${subFontSize * 1.2}px sans-serif`
          ctx.fillStyle = colors.cta
          const txt = opts.discountPrice
            ? `${opts.discountPrice}${opts.retailPrice ? `  (reg. ${opts.retailPrice})` : ""}`
            : opts.retailPrice || ""
          ctx.fillText(txt, w / 2, curY)
          curY += subFontSize * 1.5
        }

        // CTA
        if (opts.cta) {
          ctx.font = `bold ${ctaFontSize}px sans-serif`
          const ctaW = ctx.measureText(opts.cta).width + 60
          const ctaH = ctaFontSize * 2.2
          ctx.fillStyle = colors.cta
          drawRoundRect(ctx, (w - ctaW) / 2, curY, ctaW, ctaH, 6)
          ctx.fillStyle = colors.ctaText
          ctx.fillText(opts.cta, w / 2, curY + ctaH / 2 + ctaFontSize / 3)
        }
      }

      // ─── Layout: left-panel ──────────────────────
      if (opts.layout === "left-panel") {
        const panelW = Math.round(w * 0.42)
        ctx.fillStyle = colors.bg
        ctx.fillRect(0, 0, panelW, h)

        // Accent stripe
        ctx.fillStyle = colors.cta
        ctx.fillRect(panelW - 4, 0, 4, h)

        let curY = pad * 2

        // Product title
        if (opts.productTitle) {
          ctx.textAlign = "left"
          ctx.fillStyle = colors.cta
          ctx.font = `600 ${subFontSize * 0.85}px sans-serif`
          ctx.fillText(opts.productTitle.toUpperCase(), pad, curY + subFontSize)
          curY += subFontSize + pad
        }

        // Headline
        ctx.fillStyle = colors.text
        ctx.font = `bold ${Math.round(headlineFontSize * 0.9)}px sans-serif`
        ctx.textAlign = "left"
        const hfs = Math.round(headlineFontSize * 0.9)
        const lines = wordWrap(ctx, opts.headline, panelW - pad * 2)
        const lineH = hfs * 1.25
        lines.forEach((line, i) => {
          ctx.fillText(line, pad, curY + lineH + i * lineH)
        })
        curY += lineH * lines.length + pad * 1.5

        // Price
        if (opts.discountPrice || opts.retailPrice) {
          ctx.font = `bold ${subFontSize * 1.3}px sans-serif`
          ctx.fillStyle = colors.cta
          ctx.fillText(opts.discountPrice || opts.retailPrice || "", pad, curY)
          if (opts.discountPrice && opts.retailPrice) {
            ctx.fillStyle = "rgba(255,255,255,0.4)"
            ctx.font = `${subFontSize}px sans-serif`
            ctx.fillText(`  was ${opts.retailPrice}`, pad + ctx.measureText(opts.discountPrice).width, curY)
          }
          curY += subFontSize * 2
        }

        // CTA
        if (opts.cta) {
          ctx.font = `bold ${ctaFontSize}px sans-serif`
          const ctaW = Math.min(ctx.measureText(opts.cta).width + 40, panelW - pad * 2)
          const ctaH = ctaFontSize * 2.2
          ctx.fillStyle = colors.cta
          drawRoundRect(ctx, pad, curY, ctaW, ctaH, 6)
          ctx.fillStyle = colors.ctaText
          ctx.textAlign = "center"
          ctx.fillText(opts.cta, pad + ctaW / 2, curY + ctaH / 2 + ctaFontSize / 3)
        }
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

export function AdCard({
  variation,
  index,
  showImageButton = false,
  productImageBase64,
  productImageMediaType,
  productTitle,
  retailPrice,
  discountPrice,
}: AdCardProps) {
  const [copied, setCopied] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [currentLayout, setCurrentLayout] = useState(0)
  const [currentColor, setCurrentColor] = useState(0)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(getCardText(variation))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const generateWithStyle = useCallback(async (layoutIdx: number, colorIdx: number) => {
    if (!productImageBase64 || !productImageMediaType) return

    const imageSrc = `data:${productImageMediaType};base64,${productImageBase64}`
    const { headline, cta } = getOverlayText(variation)

    try {
      const result = await createOverlayImage(imageSrc, {
        headline,
        cta,
        productTitle,
        retailPrice,
        discountPrice,
        layout: LAYOUT_STYLES[layoutIdx % LAYOUT_STYLES.length],
        colorIndex: colorIdx,
      })
      setGeneratedImage(result)
    } catch {
      // Silently fail
    }
  }, [productImageBase64, productImageMediaType, variation, productTitle, retailPrice, discountPrice])

  const handleCreateOverlay = useCallback(async () => {
    // Use the variation index to pick a default style so each card looks different
    const layoutIdx = index % LAYOUT_STYLES.length
    const colorIdx = index % ACCENT_COLORS.length
    setCurrentLayout(layoutIdx)
    setCurrentColor(colorIdx)
    await generateWithStyle(layoutIdx, colorIdx)
  }, [index, generateWithStyle])

  const handleShuffle = useCallback(async () => {
    const nextLayout = (currentLayout + 1) % LAYOUT_STYLES.length
    const nextColor = nextLayout === 0 ? (currentColor + 1) % ACCENT_COLORS.length : currentColor
    setCurrentLayout(nextLayout)
    setCurrentColor(nextColor)
    await generateWithStyle(nextLayout, nextColor)
  }, [currentLayout, currentColor, generateWithStyle])

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
            <div className="absolute top-2 right-2 flex gap-1.5">
              <button
                onClick={handleShuffle}
                className="rounded-full bg-background/80 backdrop-blur-sm p-1.5 hover:bg-background transition-colors border border-border"
                title="Try different style"
              >
                <Shuffle className="h-4 w-4" />
              </button>
              <button
                onClick={handleDownloadImage}
                className="rounded-full bg-background/80 backdrop-blur-sm p-1.5 hover:bg-background transition-colors border border-border"
                title="Download image"
              >
                <Download className="h-4 w-4" />
              </button>
            </div>
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
              onClick={generatedImage ? handleShuffle : handleCreateOverlay}
              className="w-full"
            >
              {generatedImage ? (
                <>
                  <Shuffle className="h-3.5 w-3.5 mr-1.5" />
                  Try Different Style
                </>
              ) : (
                <>
                  <ImageIcon className="h-3.5 w-3.5 mr-1.5" />
                  Create Ad Image
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export { getCardText }
