"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, ArrowUp, Paperclip } from "lucide-react"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

interface Message {
  role: "user" | "assistant"
  content: string
}

interface AIDemoProps {
  initialPrompt?: string
}

export function AIDemo({ initialPrompt = "" }: AIDemoProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState(initialPrompt)
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [showDisclaimer, setShowDisclaimer] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (initialPrompt) {
      handleSubmit(new Event("submit") as React.FormEvent)
    }
  }, [initialPrompt])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      toast.success(`File "${selectedFile.name}" uploaded successfully`)
    }
  }

  const handlePaperclipClick = () => {
    fileInputRef.current?.click()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() && !file) return

    setShowDisclaimer(true)
  }

  const handleConfirmSubmit = async () => {
    setShowDisclaimer(false)
    if (!input.trim() && !file) return

    const userMessage: Message = {
      role: "user",
      content: file ? `[File uploaded: ${file.name}] ${input}` : input,
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setFile(null)
    setLoading(true)

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: userMessage.content }),
      })

      const data = await response.json()
      let aiResponse = data.result

      // Check for identity queries
      const identityQueries = [
        "who are you",
        "what's your name",
        "which model are you",
        "who created you",
        "where are you from",
      ]
      if (identityQueries.some((query) => input.toLowerCase().includes(query))) {
        aiResponse =
          "My name is EltekAI Juja Model. I am still under development by Elly Logan at Eltek, a Kenyan tech startup. Note that not all my answers are correct since I'm still learning, be sure to double check my responses."
      }

      const aiMessage: Message = { role: "assistant", content: aiResponse }
      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error("Error:", error)
      const errorMessage: Message = { role: "assistant", content: "An error occurred while processing your request." }
      setMessages((prev) => [...prev, errorMessage])
    }

    setLoading(false)
  }

  const handleShare = async () => {
    const conversationText = messages
      .map((msg) => `${msg.role === "user" ? "You" : "EltekAI"}: ${msg.content}`)
      .join("\n\n")

    try {
      await navigator.clipboard.writeText(conversationText)
      toast.success("Conversation copied to clipboard!")
    } catch (err) {
      toast.error("Failed to copy conversation")
    }
  }

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messagesEndRef])

  return (
    <>
      <Card className="w-full bg-black/50 border-white/20 h-[500px] flex flex-col">
        <CardHeader className="border-b border-white/10">
          <CardTitle className="text-xl font-bold text-white flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-purple-400" />
            EltekAI Research Assistant
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow overflow-y-auto mb-4 p-4 space-y-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.role === "user" ? "bg-purple-900/50 text-white ml-4" : "bg-gray-800 text-gray-300 mr-4"
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-800 text-gray-300 p-3 rounded-lg mr-4">
                <p>EltekAI thinking...</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </CardContent>
        <div className="p-4 border-t border-white/10">
          <form onSubmit={handleSubmit} className="flex items-center space-x-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              accept=".pdf,.doc,.docx,.txt"
            />
            <Button type="button" size="icon" variant="ghost" className="text-white" onClick={handlePaperclipClick}>
              <Paperclip className="h-5 w-5" />
            </Button>
            <Textarea
              placeholder="Enter your research topic or question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-grow bg-black/50 border-white/20 text-white placeholder-gray-400 resize-none"
              rows={1}
            />
            <Button type="submit" size="icon" disabled={loading || (!input.trim() && !file)}>
              <ArrowUp className="h-5 w-5" />
            </Button>
          </form>
        </div>
      </Card>

      <Dialog open={showDisclaimer} onOpenChange={setShowDisclaimer}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Disclaimer</DialogTitle>
            <DialogDescription>
              Please note that EltekAI is still under development. Responses may not be entirely accurate. Always
              double-check the information provided.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowDisclaimer(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmSubmit}>Proceed</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

