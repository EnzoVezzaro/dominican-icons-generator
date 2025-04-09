export interface Settings {
  provider: string
  model: string
  apiKey: string
}

export interface ImageData {
  id: string
  url: string
  styleId: string
  uploadedImage: string
  timestamp: string
  provider: string
  model: string
}
