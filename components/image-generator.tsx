"use client"

import React, { useState, useCallback, useEffect } from "react"; // Import useEffect
import { PlusIcon, EqualIcon as Equals, RefreshCw, Upload, Text } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import StyleSelector from "@/components/style-selector"
import { useToast } from "@/hooks/use-toast"
import { useSettings } from "@/hooks/use-settings"
import { useLocalStorage } from "@/hooks/use-local-storage"
import SettingsButton from "@/components/settings-button"
import ImageGallery from "@/components/image-gallery"
import { generateImage } from "@/lib/image-generation"
import type { ImageData } from "@/types"

export default function ImageGenerator() {
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeInput, setActiveInput] = useState<"text" | "upload" | null>(null);
  const [inputText, setInputText] = useState<string>("");
  const { toast } = useToast();
  const { settings } = useSettings();
  const { items: savedImages, addItem: saveImage } = useLocalStorage<ImageData[]>("saved-images", []);

  // State for scrolling text effect
  const objectTypes = ["STICKERS", "PINS", "POSTS", "PROFILE"];
  const [currentTypeIndex, setCurrentTypeIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTypeIndex((prevIndex) => (prevIndex + 1) % objectTypes.length);
    }, 2000); // Change word every 2 seconds

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, [objectTypes.length]);


  const handleStyleSelect = useCallback((styleId: string | null) => {
    setSelectedStyle(styleId);
  }, [])

  const handleImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file",
          variant: "destructive",
        })
        return
      }

      const reader = new FileReader()
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    },
    [toast],
  )

  const handleGenerate = useCallback(async () => {
    if (!selectedStyle || (!uploadedImage && activeInput === "upload") || (!inputText && activeInput === "text")) {
      toast({
        title: "Missing selection",
        description: "Please select a style and provide an image or text",
        variant: "destructive",
      });
      return; // Ensure this return statement is properly executed
    }

    if (!settings.apiKey) {
      console.log('here: ', selectedStyle, uploadedImage, activeInput, inputText);
      toast({
        title: "API Key Required",
        description: "Please add an API key in settings",
        variant: "destructive",
      })
      return
    }

    console.log('here: ', selectedStyle, uploadedImage, activeInput, inputText);

    setIsGenerating(true);
    try {
      const input = activeInput === "text" ? inputText : (uploadedImage || "");
      const result = await generateImage(selectedStyle, input, inputText, settings);
      setGeneratedImage(result.imageUrl);
    } catch (error) {
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  }, [selectedStyle, uploadedImage, inputText, activeInput, settings, toast]);

  const handleSaveImage = useCallback(() => {
    if (generatedImage) {
      const newImage: ImageData = {
        id: Date.now().toString(),
        url: generatedImage,
        styleId: selectedStyle || "",
        uploadedImage: uploadedImage || "",
        timestamp: new Date().toISOString(),
        provider: settings.provider,
        model: settings.model,
      }
      saveImage(newImage)
      toast({
        title: "Image saved",
        description: "Image has been saved to your collection",
      })
    }
  }, [generatedImage, selectedStyle, uploadedImage, settings, saveImage, toast])

  const handleReset = useCallback(() => {
    setUploadedImage(null)
    setGeneratedImage(null)
  }, [])

  const handleAction = useCallback(() => {
    if (isGenerating) return
    if ((uploadedImage || inputText) && selectedStyle && !generatedImage) {
      handleGenerate()
    } else {
      handleReset()
    }
  }, [isGenerating, inputText, uploadedImage, selectedStyle, generatedImage, handleGenerate, handleReset])

  return (
    <div className="flex flex-col items-center justify-center max-w-screen-md mx-auto">
      <div className="text-center mb-12 mt-6">
        <span className="px-3 py-1 text-xs font-semibold bg-black text-white rounded-full">image generator</span>
        <h2 className="text-5xl font-bold mb-4 mt-2">UNLEASH YOUR CREATIVITY</h2>
      </div>

      <div className="bg-yellow-200 rounded-xl p-8 w-full max-w-4xl mb-12 relative">
        <div className="text-center mb-6 flex justify-center items-center gap-2">
          <h3 className="text-xl font-semibold">CREATE A</h3>
          {/* Scrolling Text Effect - Adjusted */}
          <div className="relative inline-flex items-center justify-center h-10 w-36 overflow-hidden bg-yellow-100 border border-yellow-400 rounded px-4">
            {objectTypes.map((type, index) => (
              <span
                key={type}
                className="absolute w-full text-center transition-transform duration-500 ease-in-out font-medium"
                style={{
                  transform: `translateY(${(index - currentTypeIndex) * 100}%)`,
                  // Ensure only the current item is fully visible, others are moved out
                }}
              >
                {type}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="w-full max-w-[150px]">
              <StyleSelector selectedStyle={selectedStyle} onSelectStyle={handleStyleSelect} />
            </div>
            <p className="mt-4 font-semibold">STYLE</p>
          </div>

          <div className="flex items-center justify-center">
            <PlusIcon size={32} />
          </div>

          <div className="flex flex-col items-center">
            <div
              className={`user-actions-container w-full aspect-square bg-red-500 flex flex-col items-center justify-center overflow-hidden border-2 border-dashed border-gray-400 rounded-xl p-4`}
              style={{ minHeight: "150px", maxWidth: "150px"}}
            >
              {uploadedImage ? (
                <img
                  src={uploadedImage || "/placeholder.svg"}
                  alt="Uploaded image"
                  className="w-full h-full object-cover"
                />
              ) : (
                <>
                  {
                    (activeInput === null || activeInput === 'text') &&
                    <>
                      <Textarea
                        placeholder="ENTER YOUR PROMPT"
                        className={`w-full resize-none border-none focus:ring-0 focus:outline-none focus:border-none placeholder-white`}
                        style={{
                          height: '50%', 
                          minHeight: activeInput === 'text' ? '100%' : '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          background: 'transparent',
                          textAlign: 'center', 
                          paddingTop: '10px',
                          fontSize: activeInput === 'text' ? '1rem' : '0.75rem',
                          outline: 'none',
                          boxShadow: 'none',
                        }}
                        onClick={() => setActiveInput("text")}
                        onBlur={() => {
                          if (!inputText) {
                            setActiveInput(null);
                          }
                        }}
                        value={inputText}
                        onChange={(e) => {
                          if (!e.target.value){
                            setActiveInput(null)
                            setInputText(e.target.value)
                          } else {
                            setActiveInput("text")
                            setInputText(e.target.value)
                          }
                        }}
                      />
                      {
                        activeInput === null &&
                        <div className="dashed-divider w-full border-b-2 border-dashed border-gray-400 my-2" />
                      }
                    </>
                  }
                  {
                    (activeInput === null ||  activeInput === 'upload') &&
                    <div className="flex flex-col items-center justify-center p-4 text-center relative" style={{height: '50%', width: '100%'}}>
                      <Upload className="mb-2 text-white" />
                      <p className="text-white text-xs">ADD YOUR IMAGE</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                  }
                </>
              )}
            </div>
            <p className="mt-4 font-semibold">REFERENCE</p>
          </div>

          <div className="md:col-span-3 flex justify-center mt-4">
            <Equals size={32} />
          </div>

          <div className="md:col-span-3 flex flex-col items-center justify-center">
            <div className="w-64 h-64 bg-white rounded-lg border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
              {generatedImage ? (
                <img
                  src={generatedImage || "/placeholder.svg"}
                  alt="Generated image"
                  className="w-full h-full object-cover"
                />
              ) : isGenerating ? (
                <RefreshCw className="animate-spin" size={32} />
              ) : (
                <p className="text-gray-500">Your creation will appear here</p>
              )}
            </div>

            {generatedImage && (
              <Button onClick={handleSaveImage} className="mt-4 bg-black text-white hover:bg-gray-800">
                SAVE TO COLLECTION
              </Button>
            )}
          </div>
        </div>

        <div className="flex justify-center mt-8 flex-col w-full items-center">
          <Button
            onClick={handleAction}
            disabled={isGenerating}
            className="bg-black text-white rounded-full px-6 py-3 hover:bg-gray-800 disabled:opacity-50 w-60 mb-4"
          >
            {isGenerating ? "GENERATING..." : "CREATE IMAGE ✨"}
          </Button>
          <div className="text-black text-xs">
            Inspired by <a href="https://labs.google/fx/it/tools/whisk" target="_blank" rel="noopener noreferrer">Google Whisk</a>
          </div>
        </div>
      </div>

      <SettingsButton />
      <ImageGallery images={savedImages} />

    </div>
  )
}
