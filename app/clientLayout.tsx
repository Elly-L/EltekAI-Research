"use client"

import type React from "react"
import "./globals.css"
import Navbar from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <div className="flex flex-col min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02]">
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}

