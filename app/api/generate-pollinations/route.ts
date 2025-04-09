import { type NextRequest, NextResponse } from "next/server"
import { createImageService } from "pollinationsai"

export async function POST(request: NextRequest) {
  try {
    const { styleId, uploadedImage, apiKey, model } = await request.json()

    if (!apiKey) {
      return NextResponse.json({ error: "API key is required" }, { status: 400 })
    }

    if (!uploadedImage) {
      return NextResponse.json({ error: "Uploaded image is required" }, { status: 400 })
    }

    // Create image service with API key
    const imageService = createImageService({
      apiKey: apiKey,
    })

    // Convert base64 image to buffer
    const base64Data = uploadedImage.split(",")[1]
    const imageBuffer = Buffer.from(base64Data, "base64")

    // Generate prompt based on style
    let prompt = ""
    switch (styleId) {
      case "cartoon-cat":
        prompt = "Convert this image to a cute cartoon cat style"
        break
      case "pixel-art":
        prompt = "Convert this image to pixel art style"
        break
      case "watercolor":
        prompt = "Convert this image to watercolor painting style"
        break
      case "3d-render":
        prompt = "Convert this image to 3D rendered style"
        break
      default:
        prompt = "Convert this image to a stylized version"
    }

    // Generate image using the uploaded image as input
    try {
      // First try to use the image-to-image API if available
      const result = await imageService.generateImageFromImage(imageBuffer, prompt, {
        model: model || "flux", // Use the selected model or default to flux
        width: 1024,
        height: 1024,
        private: true,
        safe: true,
        nologo: true,
        enhance: true,
      })

      // Return the URL of the generated image
      return NextResponse.json({ imageUrl: result.url })
    } catch (imageToImageError) {
      console.warn("Image-to-image generation failed, falling back to text-to-image:", imageToImageError)

      // Fall back to text-to-image if image-to-image is not supported
      const result = await imageService.generateImage(prompt, {
        model: model || "flux",
        width: 1024,
        height: 1024,
        private: true,
        safe: true,
        nologo: true,
        enhance: true,
      })

      // Return the URL of the generated image
      return NextResponse.json({ imageUrl: result.url })
    }
  } catch (error) {
    console.error("Error generating image with Pollinations:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error occurred" },
      { status: 500 },
    )
  }
}
