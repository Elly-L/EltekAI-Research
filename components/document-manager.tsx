"use client"

import type React from "react"
import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Paperclip, X } from "lucide-react"
import { toast } from "sonner"

interface DocumentManagerProps {
  documents: string[]
  setDocuments: React.Dispatch<React.SetStateAction<string[]>>
}

export function DocumentManager({ documents, setDocuments }: DocumentManagerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files
    if (selectedFiles) {
      const newDocuments = Array.from(selectedFiles).map((file) => file.name)
      setDocuments((prev) => [...prev, ...newDocuments])
      toast.success(`${newDocuments.length} document(s) uploaded successfully`)
    }
  }

  const handleRemoveDocument = (documentName: string) => {
    setDocuments((prev) => prev.filter((doc) => doc !== documentName))
    toast.success(`Document "${documentName}" removed`)
  }

  return (
    <div className="mb-4">
      <div className="flex flex-wrap gap-2 mb-2">
        {documents.map((doc, index) => (
          <div key={index} className="flex items-center bg-purple-900/50 text-white rounded-full px-3 py-1">
            <span className="mr-2 text-sm">{doc}</span>
            <Button
              size="sm"
              variant="ghost"
              className="p-0 h-auto text-white hover:text-purple-300"
              onClick={() => handleRemoveDocument(doc)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
        multiple
        accept=".pdf,.doc,.docx,.txt"
      />
      <Button
        variant="outline"
        size="sm"
        className="text-white border-white/20 hover:bg-purple-600/20 bg-transparent"
        onClick={() => fileInputRef.current?.click()}
      >
        <Paperclip className="mr-2 h-4 w-4" />
        Add Documents
      </Button>
    </div>
  )
}

