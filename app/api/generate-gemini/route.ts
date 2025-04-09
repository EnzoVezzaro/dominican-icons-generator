import { type NextRequest, NextResponse } from "next/server"
import { google, createGoogleGenerativeAI } from "@ai-sdk/google"

export async function POST(request: NextRequest) {
  try {
    const { styleId, uploadedImage, apiKey, model } = await request.json()

    if (!apiKey) {
      return NextResponse.json({ error: "API key is required" }, { status: 400 })
    }

    if (!uploadedImage) {
      return NextResponse.json({ error: "Uploaded image is required" }, { status: 400 })
    }

    // Generate prompt based on style
    let prompt = ""
    switch (styleId) {
      case "cartoon-cat":
        prompt = "A cute cartoon cat style image"
        break
      case "pixel-art":
        prompt = "A pixel art style image"
        break
      case "watercolor":
        prompt = "A watercolor painting style image"
        break
      case "3d-render":
        prompt = "A 3D rendered style image"
        break
      default:
        prompt = "A stylized image"
    }

    // Since we can't directly use the uploaded image with Gemini's image generation yet,
    // we'll just generate an image based on the prompt
    try {
      const result = await createGoogleGenerativeAI({
        model: google("imagen-3"), // Use the model name directly
        prompt: `${prompt}. High quality, detailed image.`,
        apiKey: apiKey,
      })

      console.log(result)

      // Return the generated image as a data URL
      return NextResponse.json({
        imageUrl: `data:image/png;base64,${result.base64}`,
      })
    } catch (genError) {
      console.error("Detailed Gemini generation error:", genError)
      throw new Error(`Gemini image generation failed: ${genError.message || "Unknown error"}`)
    }
  } catch (error) {
    console.error("Error generating image with Gemini:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error occurred" },
      { status: 500 },
    )
  }
}
