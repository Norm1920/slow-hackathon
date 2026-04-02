"use client"

import { useState, useCallback } from "react"
import { Sparkles, Loader2, AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { ImageUpload } from "@/components/ImageUpload"
import { Controls } from "@/components/Controls"
import { ResultsGrid } from "@/components/ResultsGrid"
import { ThemeSwitcher } from "@/components/theme-switcher"
import {
  AUDIENCES,
  MESSAGING_ANGLES,
  PLATFORMS,
  type AdVariation,
  type Platform,
} from "@/lib/types"

const LOADING_MESSAGES = [
  "Analyzing your product image...",
  "Studying the target audience...",
  "Crafting scroll-stopping hooks...",
  "Writing platform-specific copy...",
  "Applying voice-of-customer language...",
  "Polishing your ad variations...",
  "Almost there — finalizing creative...",
]

export default function Home() {
  // Product details
  const [productTitle, setProductTitle] = useState("")
  const [retailPrice, setRetailPrice] = useState("")
  const [discountPrice, setDiscountPrice] = useState("")
  const [pieceCount, setPieceCount] = useState("")

  // Image state
  const [imageBase64, setImageBase64] = useState<string | null>(null)
  const [imageMediaType, setImageMediaType] = useState<
    "image/png" | "image/jpeg" | "image/webp"
  >("image/png")
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // Controls state
  const [audienceId, setAudienceId] = useState("christian_moms")
  const [customAudience, setCustomAudience] = useState("")
  const [angleId, setAngleId] = useState("pain_point")
  const [customAngle, setCustomAngle] = useState("")
  const [platforms, setPlatforms] = useState<Platform[]>([])
  const [ideaCount, setIdeaCount] = useState(10)
  const [wantImages, setWantImages] = useState(false)

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false)
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [variations, setVariations] = useState<AdVariation[] | null>(null)
  const [cooldown, setCooldown] = useState(false)

  const handleImageSelect = useCallback(
    (base64: string, mediaType: "image/png" | "image/jpeg" | "image/webp") => {
      setImageBase64(base64)
      setImageMediaType(mediaType)
      setImagePreview(`data:${mediaType};base64,${base64}`)
    },
    []
  )

  const handleImageClear = useCallback(() => {
    setImageBase64(null)
    setImagePreview(null)
  }, [])

  const getAudienceText = (): string => {
    if (audienceId === "custom") return customAudience
    const found = AUDIENCES.find((a) => a.id === audienceId)
    return found ? `${found.label} — ${found.description}` : ""
  }

  const getAngleText = (): string => {
    if (angleId === "custom") return customAngle
    const found = MESSAGING_ANGLES.find((a) => a.id === angleId)
    return found ? `${found.label}: ${found.description}` : ""
  }

  const canGenerate =
    imageBase64 &&
    getAudienceText().trim() &&
    getAngleText().trim() &&
    platforms.length > 0

  const handleGenerate = async () => {
    if (!canGenerate || isGenerating || cooldown) return

    setIsGenerating(true)
    setError(null)
    setVariations(null)
    setLoadingMessageIndex(0)

    // Cycle loading messages
    const interval = setInterval(() => {
      setLoadingMessageIndex((prev) =>
        prev < LOADING_MESSAGES.length - 1 ? prev + 1 : prev
      )
    }, 3000)

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64,
          imageMediaType,
          brand: "Tektones",
          productTitle: productTitle.trim() || undefined,
          retailPrice: retailPrice.trim() || undefined,
          discountPrice: discountPrice.trim() || undefined,
          pieceCount: pieceCount.trim() || undefined,
          audience: getAudienceText(),
          angle: getAngleText(),
          platforms,
          ideaCount,
        }),
      })

      const text = await response.text()
      let data
      try {
        data = JSON.parse(text)
      } catch {
        throw new Error(
          text.length > 200
            ? "Image too large. Try a smaller image (under 5MB)."
            : `Server error: ${text.slice(0, 100)}`
        )
      }

      if (!response.ok) {
        throw new Error(data.error || "Generation failed")
      }

      setVariations(data.variations)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      clearInterval(interval)
      setIsGenerating(false)
      // Cooldown to prevent API spam
      setCooldown(true)
      setTimeout(() => setCooldown(false), 5000)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-6xl flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="font-semibold text-lg">Tektones Ad Engine</span>
          </div>
          <ThemeSwitcher />
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-4 py-8 space-y-8">
        {/* Input Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Image Upload */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <h2 className="text-sm font-semibold mb-2">Product Name</h2>
                  <Input
                    placeholder="e.g. Jonah and the Whale"
                    value={productTitle}
                    onChange={(e) => setProductTitle(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <h2 className="text-sm font-semibold mb-2">Retail Price</h2>
                    <Input
                      placeholder="$149"
                      value={retailPrice}
                      onChange={(e) => setRetailPrice(e.target.value)}
                    />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold mb-2">Sale Price</h2>
                    <Input
                      placeholder="$100"
                      value={discountPrice}
                      onChange={(e) => setDiscountPrice(e.target.value)}
                    />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold mb-2">Pieces</h2>
                    <Input
                      placeholder="1,163"
                      value={pieceCount}
                      onChange={(e) => setPieceCount(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <h2 className="text-sm font-semibold mb-2">Product Image</h2>
                </div>
                <ImageUpload
                  onImageSelect={handleImageSelect}
                  onImageClear={handleImageClear}
                  preview={imagePreview}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right: Controls */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="pt-6">
                <Controls
                  audienceId={audienceId}
                  onAudienceChange={setAudienceId}
                  customAudience={customAudience}
                  onCustomAudienceChange={setCustomAudience}
                  angleId={angleId}
                  onAngleChange={setAngleId}
                  customAngle={customAngle}
                  onCustomAngleChange={setCustomAngle}
                  platforms={platforms}
                  onPlatformsChange={setPlatforms}
                  ideaCount={ideaCount}
                  onIdeaCountChange={setIdeaCount}
                  wantImages={wantImages}
                  onWantImagesChange={setWantImages}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Generate Button */}
        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={handleGenerate}
            disabled={!canGenerate || isGenerating || cooldown}
            className="px-8 py-6 text-base"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Generating...
              </>
            ) : cooldown ? (
              "Cooling down..."
            ) : (
              <>
                <Sparkles className="h-5 w-5 mr-2" />
                Generate Ad Creative
              </>
            )}
          </Button>
        </div>

        {/* Loading State */}
        {isGenerating && (
          <Card className="border-primary/20">
            <CardContent className="py-8 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
              <p className="text-sm font-medium">
                {LOADING_MESSAGES[loadingMessageIndex]}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                This usually takes 15-25 seconds
              </p>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {error && !isGenerating && (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="py-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-destructive">
                    Generation failed
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">{error}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGenerate}
                  disabled={cooldown}
                >
                  <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                  Retry
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {variations && !isGenerating && (
          <>
            <Separator />
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Generated Ad Creative
              </h2>
              <ResultsGrid variations={variations} wantImages={wantImages} productImageBase64={imageBase64} productImageMediaType={imageMediaType} />
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-border mt-16">
        <div className="mx-auto max-w-6xl px-4 py-6 text-center text-xs text-muted-foreground">
          Tektones Ad Engine &middot; Powered by Claude
        </div>
      </footer>
    </main>
  )
}
