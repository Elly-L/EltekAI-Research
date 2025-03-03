import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, FileText, Podcast, Image, Users, BookOpen } from "lucide-react"

export default function FeaturesPage() {
  const features = [
    {
      icon: FileText,
      title: "AI-powered Paper Analysis",
      description: "Our advanced AI analyzes your research papers, extracting key insights and data points.",
    },
    {
      icon: Podcast,
      title: "Podcast Creation",
      description: "Transform your research into engaging audio content, perfect for on-the-go learning.",
    },
    {
      icon: Image,
      title: "Visual Content Generation",
      description: "Create stunning infographics and visual abstracts from your research data.",
    },
    {
      icon: Users,
      title: "Collaborative Research Tools",
      description: "Work seamlessly with your team, sharing insights and collaborating in real-time.",
    },
    {
      icon: BookOpen,
      title: "Reference Manager Integration",
      description: "Easily integrate with popular reference managers to streamline your research workflow.",
    },
    {
      icon: CheckCircle,
      title: "Automated Citation",
      description: "Automatically generate and format citations for your research papers.",
    },
  ]

  return (
    <div className="min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02]">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center text-white mb-12">EltekAI Features</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-black/50 border-white/20 hover:bg-white/10 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <feature.icon className="w-6 h-6 mr-2 text-purple-400" />
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

