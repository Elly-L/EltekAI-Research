"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

// Create a custom event for login state changes
const loginStateChange = new Event("loginStateChange")

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("signin")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const email = (form.elements.namedItem("email") as HTMLInputElement).value

    // Store the email in localStorage
    localStorage.setItem("userEmail", email)

    // Dispatch the custom event
    window.dispatchEvent(loginStateChange)

    // Show success message
    toast.success("Successfully signed in!")

    // Redirect to home page
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02] flex items-center justify-center">
      <Card className="w-full max-w-md bg-black/80 border border-white/20 shadow-lg shadow-purple-500/20">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-white">
            {activeTab === "signin" ? "Welcome Back" : "Join EltekAI"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-black/50">
              <TabsTrigger value="signin" className="text-white data-[state=active]:bg-purple-600">
                Sign In
              </TabsTrigger>
              <TabsTrigger value="signup" className="text-white data-[state=active]:bg-purple-600">
                Sign Up
              </TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <form className="space-y-4" onSubmit={handleSubmit}>
                <Input
                  type="email"
                  placeholder="Email"
                  className="bg-black/50 border-white/20 text-white placeholder-gray-400"
                  name="email"
                />
                <Input
                  type="password"
                  placeholder="Password"
                  className="bg-black/50 border-white/20 text-white placeholder-gray-400"
                />
                <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                  Sign In
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form className="space-y-4" onSubmit={handleSubmit}>
                <Input
                  type="text"
                  placeholder="Full Name"
                  className="bg-black/50 border-white/20 text-white placeholder-gray-400"
                />
                <Input
                  type="email"
                  placeholder="Email"
                  className="bg-black/50 border-white/20 text-white placeholder-gray-400"
                  name="email"
                />
                <Input
                  type="password"
                  placeholder="Password"
                  className="bg-black/50 border-white/20 text-white placeholder-gray-400"
                />
                <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                  Sign Up
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

