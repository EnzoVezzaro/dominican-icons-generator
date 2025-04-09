import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SettingsProvider } from "@/hooks/use-settings"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Whisk - AI Image Generator",
  description: "Create magical images with AI",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SettingsProvider>{children}</SettingsProvider>
      </body>
    </html>
  )
}


import './globals.css'