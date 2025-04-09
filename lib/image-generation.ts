import type { Settings } from "@/types"

export async function generateImage(styleId: string, uploadedImage: string, settings: Settings) {
  try {
    if (settings.provider === "pollinations") {
      return await generateWithPollinations(styleId, uploadedImage, settings)
    } else if (settings.provider === "gemini") {
      return await generateWithGemini(styleId, uploadedImage, settings)
    } else {
      throw new Error(`Unsupported provider: ${settings.provider}`)
    }
  } catch (error) {
    console.error("Error generating image:", error)
    throw error
  }
}

async function generateWithPollinations(styleId: string, uploadedImage: string, settings: Settings) {
  // We need to call our server action to handle the API call
  return await callPollinationsAPI(styleId, uploadedImage, settings)
}

async function generateWithGemini(styleId: string, uploadedImage: string, settings: Settings) {
  // We need to call our server action to handle the API call
  return await callGeminiAPI(styleId, uploadedImage, settings)
}

// These functions will call our server actions
async function callPollinationsAPI(styleId: string, uploadedImage: string, settings: Settings) {
  try {
    const response = await fetch("/api/generate-pollinations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        styleId,
        uploadedImage,
        apiKey: settings.apiKey,
        model: settings.model,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(errorText || `Failed to generate image with Pollinations AI: ${response.status}`)
    }

    const data = await response.json()
    return {
      imageUrl: data.imageUrl,
      provider: "pollinations",
      model: settings.model,
    }
  } catch (error) {
    console.error("Error calling Pollinations API:", error)
    throw error
  }
}

async function callGeminiAPI(styleId: string, uploadedImage: string, settings: Settings) {
  try {
    // For debugging, log what we're sending to the API
    console.log("Calling Gemini API with:", {
      styleId,
      model: settings.model,
      apiKeyProvided: !!settings.apiKey,
    })

    const response = await fetch("/api/generate-gemini", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        styleId,
        uploadedImage,
        apiKey: settings.apiKey,
        model: settings.model,
      }),
    })

    // For debugging, log the response status
    console.log("Gemini API response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(errorText || `Failed to generate image with Google Gemini: ${response.status}`)
    }

    const data = await response.json()
    return {
      imageUrl: data.imageUrl,
      provider: "gemini",
      model: settings.model,
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error)
    throw error
  }
}
