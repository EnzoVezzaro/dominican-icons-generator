"use client"

import type React from "react"

import { useState } from "react"
import { Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useSettings } from "@/hooks/use-settings"
import { useLocalStorage } from "@/hooks/use-local-storage"
import type { ImageData } from "@/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SettingsButton() {
  const { settings, updateSettings } = useSettings()
  const [exportFormat, setExportFormat] = useState<"json" | "zip">("json")
  const { items: savedImages } = useLocalStorage<ImageData>("saved-images", [])
  const [activeTab, setActiveTab] = useState("providers")

  const handleProviderChange = (value: string) => {
    updateSettings({ provider: value })
  }

  const handleModelChange = (value: string) => {
    updateSettings({ model: value })
  }

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSettings({ apiKey: e.target.value })
  }

  const handleExportImages = () => {
    if (savedImages.length === 0) {
      return
    }

    if (exportFormat === "json") {
      // Export as JSON
      const dataStr = JSON.stringify(savedImages, null, 2)
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`

      const exportFileDefaultName = `whisk-images-${new Date().toISOString().slice(0, 10)}.json`

      const linkElement = document.createElement("a")
      linkElement.setAttribute("href", dataUri)
      linkElement.setAttribute("download", exportFileDefaultName)
      linkElement.click()
    } else {
      // In a real app, we would use JSZip to create a zip file with all images
      alert("ZIP export would be implemented in a production app")
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-6 right-6 h-12 w-12 rounded-full bg-white shadow-lg border-2 border-black"
        >
          <Settings className="h-6 w-6" />
          <span className="sr-only">Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Configure your image generation providers and export options.</DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="providers">Providers</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
          </TabsList>

          <TabsContent value="providers" className="space-y-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="provider" className="text-right">
                Provider
              </Label>
              <Select value={settings.provider} onValueChange={handleProviderChange}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pollinations">Pollinations AI</SelectItem>
                  <SelectItem value="gemini">Google Gemini</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="model" className="text-right">
                Model
              </Label>
              <Select value={settings.model} onValueChange={handleModelChange}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  {settings.provider === "pollinations" ? (
                    <>
                      <SelectItem value="flux">Flux</SelectItem>
                      <SelectItem value="flux-fast">Flux Fast</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="imagen-3">Imagen 3</SelectItem>
                      <SelectItem value="imagen-3-fast">Imagen 3 Fast</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="apiKey" className="text-right">
                API Key
              </Label>
              <Input
                id="apiKey"
                type="password"
                value={settings.apiKey}
                onChange={handleApiKeyChange}
                className="col-span-3"
              />
            </div>

            <div className="mt-4 text-sm text-gray-500">
              <p>
                {settings.provider === "pollinations" ? (
                  <>
                    Get your Pollinations AI API key from{" "}
                    <a
                      href="https://pollinations.ai"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      pollinations.ai
                    </a>
                  </>
                ) : (
                  <>
                    Get your Google Gemini API key from{" "}
                    <a
                      href="https://ai.google.dev/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      ai.google.dev
                    </a>
                  </>
                )}
              </p>
            </div>
          </TabsContent>

          <TabsContent value="export" className="space-y-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="exportFormat" className="text-right">
                Format
              </Label>
              <Select value={exportFormat} onValueChange={(value) => setExportFormat(value as "json" | "zip")}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="zip">ZIP Archive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleExportImages} disabled={savedImages.length === 0} className="w-full mt-4">
              Export {savedImages.length} Images
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
