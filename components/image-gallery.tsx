"use client"

import { useState } from "react"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import type { ImageData } from "@/types"
import { ChevronUp, Trash2, Download } from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"

interface ImageGalleryProps {
  images: ImageData[]
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [open, setOpen] = useState(false)
  const { removeItem } = useLocalStorage<ImageData[]>("saved-images", [])

  const handleDeleteImage = (id: string) => {
    removeItem((items) => items?.filter((item) => item.id !== id))
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

  if (images.length === 0) {
    return null
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 rounded-full px-6 py-2 bg-white shadow-lg border-2 border-black"
        >
          <ChevronUp className="mr-2 h-4 w-4" />
          {images.length} Saved Images
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-7xl">
          <DrawerHeader>
            <DrawerTitle>Your Image Collection</DrawerTitle>
            <DrawerDescription>All your generated images are saved locally on your device.</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {images.map((image) => (
              <div key={image.id} className="relative group">
                <div className="aspect-square overflow-hidden rounded-lg border-2 border-gray-200">
                  <img
                    src={image.url || "/placeholder.svg"}
                    alt={`Generated with ${image.styleId}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 transition-all flex items-center justify-center opacity-0 hover:opacity-100">
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
            ))}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
