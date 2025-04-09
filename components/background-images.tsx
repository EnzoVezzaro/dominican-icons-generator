"use client"

import { useLocalStorage } from "@/hooks/use-local-storage"
import { useState } from "react"
import type { ImageData } from "@/types"
import { ChevronUp, Trash2, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function BackgroundImages() {
  const { items: savedImages } = useLocalStorage<ImageData[]>("saved-images", [])
  const [isHovering, setIsHovering] = useState<number | null>(null)
  const { removeItem } = useLocalStorage<ImageData>("saved-images", [])

  if (savedImages.length === 0) {
    console.log('No saved images to display')
    return null
  }

  const handleDeleteImage = (id: string) => {
    removeItem((items) => items.filter((item) => item.id !== id))
  }

  const handleDownloadImage = async (image: ImageData) => {
    try {
      const response = await fetch(image.url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `domimagine-image-${image.id}.png`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      a.remove()
    } catch (error) {
      console.error("Error downloading image:", error)
    }
  }

  return (
    <div className="absolute inset-0 overflow-hidden z-10">
      {savedImages.map((image, index) => {
        // Stack from bottom with angles
        const angle = index * 15 - 15 // 15 degree increment per image, centered
        const left = `${10 + index * 8}%` // Horizontal spacing
        const bottom = `${-3}%` // Position at the bottom with consistent base
        
        // Animation class for the currently hovered image
        const isHovered = isHovering === index

        return (
          <div
            key={`bg-${image.id}`}
            className="absolute cursor-pointer"
            style={{
              left,
              bottom,
              width: '200px',
              height: '300px',
              zIndex: isHovered ? 20 : 10 + index,
              transform: `rotate(${angle}deg)`,
              transition: 'transform 0.5s ease, translate 0.5s ease',
              translate: isHovered ? '0 -40px' : '0 0',
              animation: isHovered ? 'floatUpDown 3s ease-in-out infinite' : 'none',
            }}
            onMouseEnter={() => setIsHovering(index)}
            onMouseLeave={() => setIsHovering(null)}
          >
            <div className="relative group">
              <img
                src={image.url}
                alt=""
                className="w-full h-full object-cover rounded-lg border-4 border-white shadow-lg"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex gap-2">
                  <Button size="icon" variant="destructive" onClick={() => handleDeleteImage(image.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button size="icon" onClick={() => handleDownloadImage(image)}>
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="mt-1 text-xs truncate">Style: {image.styleId}</p>
              <p className="text-xs text-gray-500">{new Date(image.timestamp).toLocaleDateString()}</p>
            </div>
          </div>
        )
      })}
      
      {/* Add the floating animation keyframes */}
      <style jsx global>{`
        @keyframes floatUpDown {
          0%, 100% { translate: 0 -40px; }
          50% { translate: 0 -60px; }
        }
      `}</style>
    </div>
  )
}