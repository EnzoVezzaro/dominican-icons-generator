"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"

const OBJECTS = [
  { id: "cat", name: "Cat", image: "/placeholder.svg?height=100&width=100" },
  { id: "dog", name: "Dog", image: "/placeholder.svg?height=100&width=100" },
  { id: "landscape", name: "Landscape", image: "/placeholder.svg?height=100&width=100" },
  { id: "robot", name: "Robot", image: "/placeholder.svg?height=100&width=100" },
  { id: "food", name: "Food", image: "/placeholder.svg?height=100&width=100" },
]

interface ObjectSelectorProps {
  selectedObject: string | null
  onSelectObject: (object: string) => void
}

export default function ObjectSelector({ selectedObject, onSelectObject }: ObjectSelectorProps) {
  const [showAll, setShowAll] = useState(false)

  const displayedObjects = showAll ? OBJECTS : OBJECTS.slice(0, 3)

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-2">
        {displayedObjects.map((object) => (
          <Card
            key={object.id}
            className={`p-2 cursor-pointer transition-all ${
              selectedObject === object.id
                ? "border-4 border-orange-500 shadow-lg transform scale-105"
                : "border border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => onSelectObject(object.id)}
          >
            <div className="aspect-square w-full bg-red-500 rounded-full flex items-center justify-center overflow-hidden">
              <img src={object.image || "/placeholder.svg"} alt={object.name} className="w-full h-full object-cover" />
            </div>
          </Card>
        ))}

        {!showAll && OBJECTS.length > 3 && (
          <button onClick={() => setShowAll(true)} className="text-sm text-gray-600 underline mt-2">
            Show more objects...
          </button>
        )}
      </div>
    </div>
  )
}
