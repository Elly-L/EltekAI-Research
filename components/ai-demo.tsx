"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles, Send } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { DocumentManager } from "@/components/document-manager"
import { toast } from "sonner"

interface Message {
  role: "user" | "assistant"
  content: string
  reasoning?: string
  showReasoning?: boolean
}

interface AIDemoProps {
  initialPrompt?: string
}

export function AIDemo({ initialPrompt = "" }: AIDemoProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState(initialPrompt)
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [showDisclaimer, setShowDisclaimer] = useState(false)
  const [hasShownDisclaimer, setHasShownDisclaimer] = useState(false)
  const [documents, setDocuments] = useState<string[]>([])
  const [autoScroll, setAutoScroll] = useState(true)

  useEffect(() => {
    if (initialPrompt) {
      handleSubmit(new Event("submit") as React.FormEvent)
    }
  }, [initialPrompt])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() && documents.length === 0) return

    if (!hasShownDisclaimer) {
      setShowDisclaimer(true)
    } else {
      await handleConfirmSubmit()
    }
  }

  const handleConfirmSubmit = async () => {
    setShowDisclaimer(false)
    setHasShownDisclaimer(true)
    if (!input.trim() && documents.length === 0) return

    const userMessage: Message = {
      role: "user",
      content: documents.length > 0 ? `[Documents: ${documents.join(", ")}] ${input}` : input,
    }
    setMessages((prevMessages) => [userMessage, ...prevMessages])
    setInput("")
    setLoading(true)
    setAutoScroll(false) // Disable auto-scroll when submitting

    // Show the "EltekAI thinking" toast
    const toastId = toast.loading("EltekAI thinking...", {
      duration: Number.POSITIVE_INFINITY,
      position: "bottom-center",
    })

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: userMessage.content }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      const aiMessage: Message = {
        role: "assistant",
        content: data.answer,
        reasoning: data.reasoning,
        showReasoning: false,
      }
      setMessages((prev) => [aiMessage, ...prev])
    } catch (error) {
      console.error("Error:", error)
      const errorMessage: Message = {
        role: "assistant",
        content: "An error occurred while processing your request.",
      }
      setMessages((prev) => [errorMessage, ...prev])
    } finally {
      setLoading(false)
      setAutoScroll(true) // Re-enable auto-scroll after response
      toast.dismiss(toastId) // Dismiss the "EltekAI thinking" toast
    }
  }

  useEffect(() => {
    if (autoScroll && messagesEndRef.current) {
      const scrollContainer = messagesEndRef.current.parentElement
      if (scrollContainer) {
        scrollContainer.scrollTop = 0
      }
    }
  }, [messages, autoScroll])

  return (
    <div className="flex flex-col h-screen bg-black/[0.96]">
      <div className="flex-grow flex flex-col overflow-hidden">
        <div className="bg-black/80 border-b border-white/10 p-4">
          <h2 className="text-xl font-bold text-white flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-purple-400" />
            EltekAI Research Assistant
          </h2>
        </div>
        <div className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-black/20">
          <div className="max-w-4xl mx-auto p-4 space-y-6 flex flex-col-reverse">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} items-end space-x-2`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === "user" ? "bg-purple-600 text-white" : "bg-gray-800 text-gray-300"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  {message.reasoning && message.showReasoning && (
                    <details>
                      <summary>Reasoning</summary>
                      <p className="whitespace-pre-wrap">{message.reasoning}</p>
                    </details>
                  )}
                </div>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === "user" ? "bg-blue-500" : "bg-green-500"
                  }`}
                >
                  {message.role === "user" ? "U" : "AI"}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
        <div className="bg-black/80 border-t border-white/10 p-4">
          <div className="max-w-4xl mx-auto">
            <DocumentManager documents={documents} setDocuments={setDocuments} />
            <form onSubmit={handleSubmit} className="flex items-center space-x-2 mt-4">
              <Textarea
                placeholder="Enter your research topic or question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-grow bg-black/50 border-white/20 text-white placeholder-gray-400 resize-none"
                rows={1}
              />
              <Button
                type="submit"
                size="icon"
                disabled={loading || (!input.trim() && documents.length === 0)}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Send className="h-5 w-5" />
              </Button>
            </form>
          </div>
        </div>
      </div>

      <Dialog open={showDisclaimer} onOpenChange={setShowDisclaimer}>
        <DialogContent className="bg-black/90 border-white/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-purple-400">Disclaimer</DialogTitle>
            <DialogDescription className="text-gray-300">
              Please note that EltekAI is still under development. Responses may not be entirely accurate. Always
              double-check the information provided.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 mt-6">
            <Button
              variant="outline"
              onClick={() => setShowDisclaimer(false)}
              className="text-white border-white/20 hover:bg-white/10 bg-transparent"
            >
              Cancel
            </Button>
            <Button onClick={handleConfirmSubmit} className="bg-purple-600 hover:bg-purple-700 text-white">
              Proceed
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

