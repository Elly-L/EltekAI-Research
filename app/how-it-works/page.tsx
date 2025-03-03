import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function HowItWorksPage() {
  const steps = [
    { title: "Upload Your Paper", description: "Simply upload your research paper in PDF format." },
    { title: "AI Analysis", description: "Our advanced AI analyzes your paper's content and structure." },
    { title: "Generate Content", description: "Choose from presentations, podcasts, or visual content." },
    { title: "Review and Edit", description: "Fine-tune the generated content to your liking." },
    { title: "Share and Present", description: "Easily share your work or use it for presentations." },
  ]

  return (
    <div className="min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02]">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center text-white mb-12">How EltekAI Works</h1>
        <div className="max-w-3xl mx-auto">
          {steps.map((step, index) => (
            <Card key={index} className="mb-8 bg-purple-900/50 border-purple-500/50">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <span className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center mr-4">
                    {index + 1}
                  </span>
                  {step.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

