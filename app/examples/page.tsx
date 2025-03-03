"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ArrowRight } from "lucide-react"

interface Example {
  id: number
  title: string
  description: string
  content: string
}

export default function ExamplesPage() {
  const [selectedExample, setSelectedExample] = useState<Example | null>(null)

  const examples: Example[] = [
    {
      id: 1,
      title: "AI-Generated Research Summary",
      description:
        "See how EltekAI summarized a 50-page research paper on climate change into a concise 2-page executive summary.",
      content: `Executive Summary: Climate Change Impact on Global Agriculture

1. Introduction:
   - Global temperatures projected to rise by 1.5°C to 2°C by 2050
   - Significant implications for agricultural productivity worldwide

2. Key Findings:
   a) Crop Yields:
      - Wheat: 6% decrease per 1°C temperature increase
      - Rice: 3.2% decrease per 1°C temperature increase
      - Maize: 7.4% decrease per 1°C temperature increase
   b) Water Stress:
      - 40% increase in water-stressed regions by 2050
      - Irrigation demands expected to rise by 10-15%
   c) Pest and Disease Prevalence:
      - 25-100% increase in pest-related crop losses
   d) Nutritional Content:
      - CO2 concentration rise leads to 3-17% decrease in protein content of major crops

3. Regional Impacts:
   - Sub-Saharan Africa: Up to 30% reduction in agricultural productivity
   - South Asia: 50% of arable land at risk of desertification
   - North America: Shift of agricultural zones northward by up to 200km per decade

4. Adaptation Strategies:
   - Development of heat and drought-resistant crop varieties
   - Implementation of precision agriculture techniques
   - Expansion of water-efficient irrigation systems
   - Diversification of crop types and farming practices

5. Policy Recommendations:
   - Increase investment in agricultural R&D by 50% over the next decade
   - Implement carbon pricing to incentivize sustainable farming practices
   - Enhance international cooperation for technology transfer and capacity building

6. Conclusion:
   Climate change poses a significant threat to global food security, necessitating urgent and coordinated action to adapt agricultural systems and mitigate further environmental degradation.`,
    },
    {
      id: 2,
      title: "Interactive Presentation",
      description:
        "Explore an engaging presentation created from a complex neuroscience study, complete with animations and key takeaways.",
      content: `Slide 1: Title
"Neuroplasticity and Cognitive Enhancement: A Breakthrough Study"

Slide 2: Introduction
- Definition of neuroplasticity
- Importance in cognitive function and learning

Slide 3: Study Overview
- 500 participants, ages 20-65
- 12-month longitudinal study
- Combination of cognitive training and non-invasive brain stimulation

Slide 4: Methodology
- Cognitive training: Adaptive computerized tasks
- Brain stimulation: Transcranial Direct Current Stimulation (tDCS)
- Control group vs. intervention group

Slide 5: Key Findings
- 27% improvement in working memory in intervention group
- 18% increase in problem-solving skills
- 15% enhancement in attention span
- Lasting effects observed 6 months post-intervention

Slide 6: Brain Imaging Results
- Increased neural connectivity in prefrontal cortex
- Enhanced activation in hippocampus during memory tasks
- Structural changes in white matter integrity

Slide 7: Implications
- Potential for cognitive enhancement in healthy adults
- Applications in age-related cognitive decline
- Promising avenue for neurodegenerative disease interventions

Slide 8: Future Directions
- Optimization of stimulation protocols
- Investigation of long-term effects
- Exploration of combined interventions (e.g., with nutrition, exercise)

Slide 9: Conclusion
- Neuroplasticity as a powerful tool for cognitive enhancement
- Importance of ethical considerations in cognitive augmentation
- Call for further research and responsible implementation

Slide 10: Q&A`,
    },
    {
      id: 3,
      title: "Research Podcast",
      description:
        "Listen to a 15-minute podcast episode generated from a lengthy economics paper, making the content accessible to a wider audience.",
      content: `Podcast Transcript: "The Impact of Artificial Intelligence on Labor Markets"

Host: Welcome to EconTalk, where we break down complex economic research into digestible insights. Today, we're discussing a groundbreaking paper on the impact of AI on labor markets.

[Music Intro]

Host: Our paper today, authored by Dr. Sarah Johnson and Dr. Michael Lee from the University of Cambridge, presents a comprehensive analysis of how AI is reshaping employment across various sectors. Let's dive into the key findings.

[Sound Effect: Data Processing]

Host: First, the study predicts that by 2030, AI could automate up to 30% of current job tasks across industries. However, it's not all doom and gloom. The research also suggests that AI will create new job categories, potentially adding 20-30 million new roles globally.

Expert Commentary: "What we're seeing is not just job displacement, but job transformation. Workers will need to adapt and acquire new skills to remain competitive in this evolving landscape."

Host: The paper highlights several sectors that will be significantly impacted:

1. Healthcare: AI is expected to enhance diagnostic accuracy by up to 40%, while also creating new roles in AI-assisted medical research and personalized medicine.

2. Finance: Automated trading and risk assessment could reduce certain financial analyst roles by 20%, but increase demand for AI ethics officers and algorithm auditors.

3. Education: AI tutors and personalized learning platforms could supplement traditional teaching, potentially improving student outcomes by 15-20%.

[Sound Effect: Transition]

Host: The study also addresses wage inequality. While AI is projected to increase overall productivity by 1.5% annually, the benefits may not be evenly distributed.

Expert Commentary: "We anticipate a 'hollowing out' of middle-skill jobs, with growth at both the high and low ends of the wage spectrum. This underscores the need for proactive policy measures to ensure inclusive growth."

Host: The researchers propose several policy recommendations:

1. Invest in AI literacy programs for workers across all sectors.
2. Implement a universal basic income to cushion potential job displacements.
3. Develop ethical guidelines for AI implementation in the workplace.

[Music Outro]

Host: As we wrap up, it's clear that AI will profoundly reshape our labor markets. While challenges lie ahead, the potential for innovation and improved quality of life is immense. For EconTalk, I'm your host, signing off.

[End of Transcript]`,
    },
    {
      id: 4,
      title: "Visual Data Representation",
      description:
        "View an infographic that visualizes key statistics and findings from a global health research project.",
      content: `Infographic: Global Vaccine Efficacy Study 2020-2022

Title: "Vaccines: A Global Health Success Story"

1. Study Overview:
   - 3-year longitudinal study
   - 50 countries
   - 1 million participants

2. Key Findings (Visualized as bar charts):
   a) Disease Incidence Reduction:
      - Measles: 91% reduction
      - Polio: 99.9% reduction
      - Pneumococcal disease: 75% reduction

   b) Economic Impact:
      - $44 billion saved in healthcare costs
      - 6.4 million workdays saved

3. Global Coverage (World map with color-coded regions):
   - High Income Countries: 94% coverage
   - Middle Income Countries: 86% coverage
   - Low Income Countries: 71% coverage

4. Challenges (Illustrated with icons):
   - Vaccine hesitancy: 12% of population
   - Cold chain logistics: 23% of rural areas face difficulties
   - Funding gaps: $1.5 billion annually

5. Future Projections (Line graph):
   - 2025: 95% global coverage target
   - 2030: Eradication of 2 more vaccine-preventable diseases

6. Call to Action:
   - Invest in vaccine education programs
   - Strengthen healthcare infrastructure
   - Support global vaccine equity initiatives

Footer: "Vaccines: Small shots, big impact on global health"`,
    },
  ]

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center text-white mb-16">EltekAI in Action</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {examples.map((example) => (
          <div
            key={example.id}
            className="bg-black/40 border border-white/10 p-8 rounded-lg hover:bg-black/60 transition-all duration-300"
          >
            <h2 className="text-2xl font-bold text-white mb-4">{example.title}</h2>
            <p className="text-gray-400 mb-6">{example.description}</p>
            <Button
              variant="ghost"
              className="text-purple-400 hover:text-purple-300 p-0 flex items-center group"
              onClick={() => setSelectedExample(example)}
            >
              View Example
              <ArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        ))}
      </div>

      <Dialog open={!!selectedExample} onOpenChange={() => setSelectedExample(null)}>
        <DialogContent className="max-w-4xl bg-black/90 border-white/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{selectedExample?.title}</DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-6">
            <pre className="whitespace-pre-wrap">{selectedExample?.content}</pre>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

