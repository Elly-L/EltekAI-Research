import { NextResponse } from "next/server"
import { HfInference } from "@huggingface/inference"

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY)

export async function POST(req: Request) {
  const { prompt } = await req.json()

  try {
    const response = await hf.textGeneration({
      model: "mistralai/Mistral-7B-Instruct-v0.3",
      inputs: prompt,
      parameters: {
        max_new_tokens: 250,
        temperature: 0.7,
        top_p: 0.95,
        repetition_penalty: 1.15,
      },
    })

    return NextResponse.json({ result: response.generated_text })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "An error occurred while processing your request." }, { status: 500 })
  }
}

