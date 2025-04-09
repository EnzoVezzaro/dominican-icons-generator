import { Suspense } from "react"
import ImageGenerator from "@/components/image-generator"
import { Toaster } from "@/components/ui/toaster"
import { Github } from "lucide-react"
import BackgroundImages from "@/components/background-images"

export default function Home() {
  return (
    <main className="min-h-screen bg-yellow-300 relative overflow-hidden">
      <div className="container mx-auto px-4 py-8 relative">
        <header className="flex justify-end items-center mb-8">
          <div className="flex items-center gap-4">
            <a 
              className="fixed bottom-6 left-5 h-12 w-12 rounded-full bg-white shadow-lg border-2 border-black flex items-center justify-center"
              href="https://github.com/EnzoVezzaro/dominican-icons-generator" target="_blank" rel="noopener noreferrer">
              <Github className="w-5 h-5" />
            </a>
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
