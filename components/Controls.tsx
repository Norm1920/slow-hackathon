"use client"

import { AUDIENCES, MESSAGING_ANGLES, PLATFORMS, type Platform } from "@/lib/types"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

const IDEA_COUNTS = [5, 10, 15] as const

interface ControlsProps {
  audienceId: string
  onAudienceChange: (id: string) => void
  customAudience: string
  onCustomAudienceChange: (text: string) => void
  angleId: string
  onAngleChange: (id: string) => void
  customAngle: string
  onCustomAngleChange: (text: string) => void
  platforms: Platform[]
  onPlatformsChange: (platforms: Platform[]) => void
  ideaCount: number
  onIdeaCountChange: (count: number) => void
  wantImages: boolean
  onWantImagesChange: (want: boolean) => void
}

export function Controls({
  audienceId,
  onAudienceChange,
  customAudience,
  onCustomAudienceChange,
  angleId,
  onAngleChange,
  customAngle,
  onCustomAngleChange,
  platforms,
  onPlatformsChange,
  ideaCount,
  onIdeaCountChange,
  wantImages,
  onWantImagesChange,
}: ControlsProps) {
  const togglePlatform = (id: Platform) => {
    if (platforms.includes(id)) {
      onPlatformsChange(platforms.filter((p) => p !== id))
    } else {
      onPlatformsChange([...platforms, id])
    }
  }

  return (
    <div className="space-y-6">
      {/* Audience Selector */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Target Audience</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {AUDIENCES.map((a) => (
            <button
              key={a.id}
              onClick={() => onAudienceChange(a.id)}
              className={cn(
                "text-left rounded-lg border p-3 text-sm transition-colors",
                audienceId === a.id
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-border hover:border-muted-foreground/50"
              )}
            >
              <div className="font-medium">{a.label}</div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {a.description}
              </div>
            </button>
          ))}
        </div>
        {audienceId === "custom" && (
          <Textarea
            placeholder="Describe your target audience..."
            value={customAudience}
            onChange={(e) => onCustomAudienceChange(e.target.value)}
            className="mt-2"
            rows={2}
          />
        )}
      </div>

      {/* Messaging Angle Selector */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Messaging Angle</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {MESSAGING_ANGLES.map((a) => (
            <button
              key={a.id}
              onClick={() => onAngleChange(a.id)}
              className={cn(
                "text-left rounded-lg border p-3 text-sm transition-colors",
                angleId === a.id
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-border hover:border-muted-foreground/50"
              )}
            >
              <div className="font-medium">{a.label}</div>
              <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                {a.description}
              </div>
            </button>
          ))}
        </div>
        {angleId === "custom" && (
          <Textarea
            placeholder="Describe your messaging angle..."
            value={customAngle}
            onChange={(e) => onCustomAngleChange(e.target.value)}
            className="mt-2"
            rows={2}
          />
        )}
      </div>

      {/* Platform Toggles */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Platforms</Label>
        <div className="flex flex-wrap gap-3">
          {PLATFORMS.map((p) => (
            <label
              key={p.id}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Checkbox
                checked={platforms.includes(p.id)}
                onCheckedChange={() => togglePlatform(p.id)}
              />
              <span className="text-sm">{p.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Idea Count */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">How many ideas do you want?</Label>
        <div className="flex gap-2">
          {IDEA_COUNTS.map((count) => (
            <button
              key={count}
              onClick={() => onIdeaCountChange(count)}
              className={cn(
                "rounded-lg border px-5 py-2 text-sm font-medium transition-colors",
                ideaCount === count
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-border hover:border-muted-foreground/50"
              )}
            >
              {count}
            </button>
          ))}
        </div>
      </div>

      {/* Want Images */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Do you want images?</Label>
        <div className="flex gap-2">
          {[true, false].map((val) => (
            <button
              key={String(val)}
              onClick={() => onWantImagesChange(val)}
              className={cn(
                "rounded-lg border px-5 py-2 text-sm font-medium transition-colors",
                wantImages === val
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-border hover:border-muted-foreground/50"
              )}
            >
              {val ? "Yes" : "No"}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
