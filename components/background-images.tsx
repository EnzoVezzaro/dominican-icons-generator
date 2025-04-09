"use client"

import { useLocalStorage } from "@/hooks/use-local-storage"
import type { ImageData } from "@/types"

export default function BackgroundImages() {
  const { items: savedImages } = useLocalStorage<ImageData[]>("saved-images", [])

  console.log('saved images: ', savedImages);
  
  console.log('Saved images count:', savedImages.length)
  console.log('Sample image URL:', savedImages[0]?.url)
  
  if (savedImages.length === 0) {
    console.log('No saved images to display')
    return null
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-9">
      {savedImages.map((image, index) => {
        // Stack from bottom with angles
        const angle = index * 15 // 15 degree increment per image
        const left = `${10 + index * 8}%` // Horizontal spacing
        const top = '80%' // Start from bottom
        
        return (
          <img
            key={`bg-${image.id}`}
            src={image.url}
            alt=""
            className="absolute"
            style={{
              transform: `rotate(${angle}deg)`,
              left,
              top,
              width: '200px',
              height: '300px',
              objectFit: 'cover',
              zIndex: 9,
              border: '4px solid white',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
              transition: 'all 0.3s ease',
              opacity: 1
            }}
          />
        )
      })}
    </div>
  )
}
