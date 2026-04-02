"use client"

import { useState } from "react"
import { Copy, Check, Download, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdCard } from "@/components/AdCard"
import { variationsToCSV, variationsToText } from "@/lib/export"
import type { AdVariation, Platform } from "@/lib/types"

interface ResultsGridProps {
  variations: AdVariation[]
  wantImages: boolean
  productImageBase64?: string | null
  productImageMediaType?: string | null
}

const PLATFORM_LABELS: Record<Platform, string> = {
  meta_feed: "Meta / Facebook",
  instagram_stories_reels: "Instagram",
  tiktok: "TikTok",
  google_display: "Google Display",
  general: "General",
}

export function ResultsGrid({ variations, wantImages, productImageBase64, productImageMediaType }: ResultsGridProps) {
  const [copiedAll, setCopiedAll] = useState(false)

  const grouped = variations.reduce(
    (acc, v) => {
      if (!acc[v.platform]) acc[v.platform] = []
      acc[v.platform].push(v)
      return acc
    },
    {} as Record<string, AdVariation[]>
  )

  const platformKeys = Object.keys(grouped) as Platform[]
  const vocCount = variations.filter((v) => v.uses_voc).length
  const vocPercentage = Math.round((vocCount / variations.length) * 100)

  const handleCopyAll = async () => {
    const text = variationsToText(variations)
    await navigator.clipboard.writeText(text)
    setCopiedAll(true)
    setTimeout(() => setCopiedAll(false), 2000)
  }

  const handleExportCSV = () => {
    const csv = variationsToCSV(variations)
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `ad-creative-${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      {/* Stats and Actions Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="text-xs">
            {variations.length} variations
          </Badge>
          <Badge variant="outline" className="text-xs">
            {platformKeys.length} platforms
          </Badge>
          <Badge
            variant="outline"
            className={`text-xs ${vocPercentage >= 30 ? "border-green-500 text-green-600" : "border-amber-500 text-amber-600"}`}
          >
            {vocPercentage}% VOC ({vocCount}/{variations.length})
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleCopyAll}>
            {copiedAll ? (
              <Check className="h-3.5 w-3.5 mr-1.5 text-green-500" />
            ) : (
              <Copy className="h-3.5 w-3.5 mr-1.5" />
            )}
            Copy All
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportCSV}>
            <Download className="h-3.5 w-3.5 mr-1.5" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Tabbed Results */}
      <Tabs defaultValue={platformKeys[0] || "all"}>
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="all" className="text-xs">
            <FileText className="h-3 w-3 mr-1" />
            All ({variations.length})
          </TabsTrigger>
          {platformKeys.map((key) => (
            <TabsTrigger key={key} value={key} className="text-xs">
              {PLATFORM_LABELS[key]} ({grouped[key].length})
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {variations.map((v, i) => (
              <AdCard key={i} variation={v} index={i} showImageButton={wantImages} productImageBase64={productImageBase64} productImageMediaType={productImageMediaType} />
            ))}
          </div>
        </TabsContent>

        {platformKeys.map((key) => (
          <TabsContent key={key} value={key} className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {grouped[key].map((v, i) => (
                <AdCard key={i} variation={v} index={i} showImageButton={wantImages} productImageBase64={productImageBase64} productImageMediaType={productImageMediaType} />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
