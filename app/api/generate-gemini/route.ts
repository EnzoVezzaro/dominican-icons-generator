import { type NextRequest, NextResponse } from "next/server"
import { google, createGoogleGenerativeAI } from "@ai-sdk/google"
import { GoogleGenAI } from "@google/genai";

export async function POST(request: NextRequest) {
  try {
    const { styleId, uploadedImage, apiKey, model } = await request.json()

    if (!apiKey) {
      return NextResponse.json({ error: "API key is required" }, { status: 400 })
    }

    const ai = new GoogleGenAI({ apiKey: apiKey });

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
      console.log('calling gemini...')
      let base64Data = uploadedImage;
      let mimeType = 'image/png'; // Default MIME type
      if (uploadedImage.startsWith('data:image/png;base64,')) {
        base64Data = uploadedImage.split(',')[1];
      } else if (uploadedImage.startsWith('data:image/jpeg;base64,')) {
        mimeType = 'image/jpeg';
        base64Data = uploadedImage.split(',')[1];
      } else {
        return NextResponse.json({ error: "Invalid image format. Only PNG and JPEG are supported." }, { status: 400 });
      }

      try {
        // Try to decode the base64 data
        const buffer = Buffer.from(base64Data, 'base64');
        // If decoding is successful, re-encode it to ensure it's in the correct format
        base64Data = buffer.toString('base64');
      } catch (error) {
        // If decoding fails, assume it's not a valid base64 string and log the error
        console.error('Error decoding base64 string:', error);
        return NextResponse.json({ error: "Invalid base64 encoded image data." }, { status: 400 });
      }

      const contents = [
        { text: `Make this image into a ${styleId} with the following instructions: ${prompt}. High quality, detailed image.` },
        {
          inlineData: {
            mimeType: mimeType,
            data: base64Data,
          },
        },
      ];
      // console.log('calling imagen...', contents)
      const response = await ai.models.generateContent({
        model: model === "imagen-3" ? "gemini-2.0-flash-exp-image-generation" : model,
        contents: contents,
        config: {
          responseModalities: ["Text", "Image"],
        },
      });

      // console.log('response: ', JSON.stringify(response));

      let imageUrl = null;
      if (response.candidates && response.candidates[0] && response.candidates[0].content && response.candidates[0].content.parts) {
        for (const part of response.candidates[0].content.parts) {
          // Based on the part type, either show the text or save the image
          if (part.text) {
            console.log(part.text);
          } else if (part.inlineData && part.inlineData.data) {
            const imageData = part.inlineData.data;
            const mimeType = part.inlineData.mimeType;
            imageUrl = `data:${mimeType};base64,${imageData}`;
            // console.log("Image saved as gemini-native-image.png", buffer);
          }
        }
      }

      // Return the generated image as a data URL
      return NextResponse.json({
        imageUrl: imageUrl,
      })
    } catch (genError: any) {
      console.error("Detailed Gemini generation error:", genError)
      throw new Error(`Gemini image generation failed: ${(genError as Error).message || "Unknown error"}`)
    }
  } catch (error) {
    console.error("Error generating image with Gemini:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error occurred" },
      { status: 500 },
    )
  }
}
