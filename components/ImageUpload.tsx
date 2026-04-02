"use client"

import { useCallback, useRef, useState } from "react"
import { Upload, X, ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface ImageUploadProps {
  onImageSelect: (base64: string, mediaType: "image/png" | "image/jpeg" | "image/webp") => void
  onImageClear: () => void
  preview: string | null
}

export function ImageUpload({ onImageSelect, onImageClear, preview }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const processFile = useCallback(
    (file: File) => {
      const validTypes = ["image/png", "image/jpeg", "image/webp"]
      if (!validTypes.includes(file.type)) {
        alert("Please upload a PNG, JPG, or WEBP image.")
        return
      }

      if (file.size > 20 * 1024 * 1024) {
        alert("Image must be under 20MB.")
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        // result is "data:image/png;base64,..."
        const base64 = result.split(",")[1]
        const mediaType = file.type as "image/png" | "image/jpeg" | "image/webp"
        onImageSelect(base64, mediaType)
      }
      reader.readAsDataURL(file)
    },
    [onImageSelect]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) processFile(file)
    },
    [processFile]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleClick = () => {
    inputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  if (preview) {
    return (
      <div className="relative">
        <div className="relative rounded-lg border border-border overflow-hidden bg-muted">
          <img
            src={preview}
            alt="Product preview"
            className="w-full h-48 object-contain"
          />
          <button
            onClick={() => {
              onImageClear()
              if (inputRef.current) inputRef.current.value = ""
            }}
            className="absolute top-2 right-2 rounded-full bg-background/80 backdrop-blur-sm p-1.5 hover:bg-background transition-colors border border-border"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={cn(
        "relative rounded-lg border-2 border-dashed p-8 text-center cursor-pointer transition-colors",
        isDragging
          ? "border-primary bg-primary/5"
          : "border-muted-foreground/25 hover:border-muted-foreground/50 hover:bg-muted/50"
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />
      <div className="flex flex-col items-center gap-2">
        <div className="rounded-full bg-muted p-3">
          {isDragging ? (
            <Upload className="h-6 w-6 text-primary" />
          ) : (
            <ImageIcon className="h-6 w-6 text-muted-foreground" />
          )}
        </div>
        <p className="text-sm font-medium">
          {isDragging ? "Drop your image here" : "Upload product image"}
        </p>
        <p className="text-xs text-muted-foreground">
          PNG, JPG, or WEBP (max 20MB)
        </p>
      </div>
    </div>
  )
}
