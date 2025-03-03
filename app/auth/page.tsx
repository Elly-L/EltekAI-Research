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
      <Card className="w-full max-w-md bg-black/50 border border-white/10">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-white">
            {activeTab === "signin" ? "Sign In" : "Get Started"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <form className="space-y-4" onSubmit={handleSubmit}>
                <Input
                  type="email"
                  placeholder="Email"
                  className="bg-black/50 border-white/20 text-white"
                  name="email"
                />
                <Input type="password" placeholder="Password" className="bg-black/50 border-white/20 text-white" />
                <Button type="submit" className="w-full bg-white text-black hover:bg-white/90">
                  Sign In
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form className="space-y-4" onSubmit={handleSubmit}>
                <Input type="text" placeholder="Full Name" className="bg-black/50 border-white/20 text-white" />
                <Input
                  type="email"
                  placeholder="Email"
                  className="bg-black/50 border-white/20 text-white"
                  name="email"
                />
                <Input type="password" placeholder="Password" className="bg-black/50 border-white/20 text-white" />
                <Button type="submit" className="w-full bg-white text-black hover:bg-white/90">
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

