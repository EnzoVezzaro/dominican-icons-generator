import { Suspense } from "react"
import ImageGenerator from "@/components/image-generator"
import { Toaster } from "@/components/ui/toaster"

export default function Home() {
  return (
    <main className="min-h-screen bg-yellow-300 relative overflow-hidden">
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">DomImagine</h1>
            <span className="px-3 py-1 text-xs font-semibold bg-black text-white rounded-full">image generator</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 border-2 border-black rounded-full font-medium">MY COLLECTION</button>
          </div>
        </header>

        <Suspense fallback={<div>Loading...</div>}>
          <ImageGenerator />
        </Suspense>
      </div>
      <Toaster />
    </main>
  )
}
