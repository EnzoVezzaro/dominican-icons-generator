import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SettingsProvider } from "@/hooks/use-settings"
import { ToastProvider, ToastViewport } from "@/components/ui/toast"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "DomImagine - AI Image Generator",
  description: "Create magical images with AI"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SettingsProvider>
          <ToastProvider>
            {children}
            <ToastViewport />
          </ToastProvider>
        </SettingsProvider>
      </body>
    </html>
  )
}
