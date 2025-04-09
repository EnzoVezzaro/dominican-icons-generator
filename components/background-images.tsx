"use client"

import { useLocalStorage } from "@/hooks/use-local-storage"
import { useState } from "react"
import type { ImageData } from "@/types"

export default function BackgroundImages() {
  const { items: savedImages } = useLocalStorage<ImageData[]>("saved-images", [])
  const [isHovering, setIsHovering] = useState<number | null>(null)
  
  if (savedImages.length === 0) {
    console.log('No saved images to display')
    return null
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
            <img
              src={image.url}
              alt=""
              className="w-full h-full object-cover rounded-lg border-4 border-white shadow-lg"
            />
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