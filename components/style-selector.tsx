"use client"

import { useState, memo } from "react"
import { Card } from "@/components/ui/card"
import { Cat, Gamepad2, Paintbrush, CuboidIcon } from "lucide-react"

// Define styles with Lucide icons
const STYLES = [
  {
    id: "cartoon-cat",
    name: "Cartoon Cat",
    icon: <Cat size={32} className="text-white" />,
    selectedIcon: <Cat size={48} className="text-white mb-2" />,
    color: "bg-teal-500",
  },
  {
    id: "pixel-art",
    name: "Pixel Art",
    icon: <Gamepad2 size={32} className="text-white" />,
    selectedIcon: <Gamepad2 size={48} className="text-white mb-2" />,
    color: "bg-blue-500",
  },
  {
    id: "watercolor",
    name: "Watercolor",
    icon: <Paintbrush size={32} className="text-white" />,
    selectedIcon: <Paintbrush size={48} className="text-white mb-2" />,
    color: "bg-purple-500",
  },
  {
    id: "3d-render",
    name: "3D Render",
    icon: <CuboidIcon size={32} className="text-white" />,
    selectedIcon: <CuboidIcon size={48} className="text-white mb-2" />,
    color: "bg-orange-500",
  },
]

interface StyleSelectorProps {
  selectedStyle: string | null
  onSelectStyle: (style: string) => void
}

function StyleSelector({ selectedStyle, onSelectStyle }: StyleSelectorProps) {
  const [showAll, setShowAll] = useState(false)

  const displayedStyles = showAll ? STYLES : STYLES.slice(0, 3)

  const selectedStyleObj = STYLES.find((style) => style.id === selectedStyle)

  return (
    <div className="w-full">
      {selectedStyle ? (
        <div
          className={`aspect-square w-full ${selectedStyleObj?.color || "bg-teal-500"} rounded-md flex items-center justify-center overflow-hidden cursor-pointer border-4 border-white shadow-md`}
          onClick={() => setShowAll(true)}
        >
          {selectedStyleObj && (
            <div className="flex flex-col items-center justify-center p-2">
              {selectedStyleObj.selectedIcon}
              <span className="text-white font-medium text-sm">{selectedStyleObj.name}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2">
          {displayedStyles.map((style) => (
            <Card
              key={style.id}
              className="p-2 cursor-pointer transition-all hover:border-gray-300"
              onClick={() => onSelectStyle(style.id)}
            >
                <div
                className={`aspect-square w-full ${style.color} rounded-md flex flex-col items-center justify-center overflow-hidden`}
                >
                {style.icon}
                <span className="text-white">
                  {style.name}
                </span>
                </div>
            </Card>
          ))}

          {!showAll && STYLES.length > 3 && (
            <button onClick={() => setShowAll(true)} className="text-sm text-gray-600 underline mt-2">
              Show more styles...
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default memo(StyleSelector)
