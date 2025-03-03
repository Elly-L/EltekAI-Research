import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"

export default function PricingPage() {
  const plans = [
    {
      name: "Basic",
      price: "500 KSH",
      features: ["5 paper uploads/month", "Basic AI analysis", "Presentation generation"],
      recommended: false,
    },
    {
      name: "Pro",
      price: "3,000 KSH",
      features: [
        "20 paper uploads/month",
        "Advanced AI analysis",
        "Presentation & podcast generation",
        "Priority support",
      ],
      recommended: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      features: [
        "Unlimited paper uploads",
        "Full suite of AI tools",
        "Custom integrations",
        "Dedicated account manager",
      ],
      recommended: false,
    },
  ]

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center text-white mb-12">Pricing Plans</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <Card
            key={index}
            className={`bg-black/50 border-white/20 flex flex-col transition-all duration-300 hover:scale-105 ${
              plan.recommended ? "ring-2 ring-purple-500" : ""
            }`}
          >
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-white">{plan.name}</CardTitle>
              {plan.recommended && (
                <span className="inline-block bg-purple-500 text-white text-xs px-2 py-1 rounded-full uppercase">
                  Recommended
                </span>
              )}
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-3xl font-bold text-white mb-4">{plan.price}</p>
              <ul className="text-gray-300 space-y-2">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <Check className="w-5 h-5 mr-2 text-green-400" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">Choose Plan</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

