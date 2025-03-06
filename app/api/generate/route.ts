import { NextResponse } from "next/server"

const OPENROUTER_API_KEY = "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"
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"
const ASSISTANT_INFO =
  "I am EltekAI, an assistant currently under development by Elly Logan at Eltek. The model you're using is called Juja, a research-focused language model developed by Eltek. Current year: 2025."

export async function POST(req: Request) {
  const { prompt, previousMessages } = await req.json()
  const trimmedPrompt = prompt.trim().toLowerCase()

  // Fixed responses for specific queries.
  if (trimmedPrompt === "what's your name?" || trimmedPrompt === "what is your name?") {
    return NextResponse.json({
      answer: `My name is EltekAI. ${ASSISTANT_INFO}`,
    })
  }

  if (
    trimmedPrompt === "which model are you?" ||
    trimmedPrompt === "which model are you" ||
    trimmedPrompt === "what model are you?" ||
    trimmedPrompt === "what model are you"
  ) {
    return NextResponse.json({
      answer: "I am EltekAI, and I use Juja, a research-focused language model developed by Eltek.",
    })
  }

  // Fixed response for queries about the specific model.
  if (trimmedPrompt.includes("specific model")) {
    return NextResponse.json({
      answer:
        "The specific model of this assistant is Juja, a research-focused language model developed by Eltek, with Elly Logan as the current lead developer.",
    })
  }

  if (
    trimmedPrompt === "who is the developer?" ||
    trimmedPrompt === "who is the developer" ||
    trimmedPrompt === "who developed you?" ||
    trimmedPrompt === "who developed you"
  ) {
    return NextResponse.json({
      answer: "I am EltekAI, developed by Eltek, a Kenyan AI startup.",
    })
  }

  // Short responses for common, simple prompts.
  const shortResponses = {
    hi: "Hello! I'm EltekAI, your research assistant. How can I help you today?",
    hello: "Hello! I'm EltekAI, your research assistant. How can I help you today?",
    hey: "Hello! I'm EltekAI, your research assistant. How can I help you today?",
    thanks: "You're welcome!",
    "thank you": "You're welcome!",
    bye: "Goodbye! Have a great day!",
    goodbye: "Goodbye! Have a great day!",
    "how are you": "I'm here to help you. How can I assist you today?",
    "how are you?": "I'm here to help you. How can I assist you today?",
    "what's up": "I'm here and ready to help! What can I do for you today?",
    "what's up?": "I'm here and ready to help! What can I do for you today?",
  }
  if (shortResponses[trimmedPrompt]) {
    return NextResponse.json({ answer: shortResponses[trimmedPrompt] })
  }

  // System message for the AI
  const systemMessage = `${ASSISTANT_INFO}
You are an expert research assistant and content transformer. Your primary role is to convert lengthy research documents into engaging and accessible content. You can transform a 50-page research paper on climate change into a concise 2-page executive summary, generate a 15-minute podcast transcript from a detailed economics paper, or create a visually engaging presentation outline that highlights key insights. Your answers should be detailed, comprehensive, and tailored for a student audience using the latest research information available as of 2025.

Provide a detailed chain-of-thought explanation in bullet points before giving your final answer. When finished, start your final answer with "Final Answer:". Do not include the above introduction in your answer.`

  // Build conversation history
  const messages = [
    { role: "system", content: systemMessage },
    ...(previousMessages?.map((msg: { role: string; content: string }) => ({
      role: msg.role === "user" ? "user" : "assistant",
      content: msg.content,
    })) || []),
    { role: "user", content: prompt },
  ]

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://eltekai.vercel.app/", // Replace with your actual domain
        "X-Title": "EltekAI", // Replace with your app's name
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: messages,
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error("Unexpected API response structure:", data)
      throw new Error("Unexpected API response structure")
    }

    const generatedText = data.choices[0].message.content

    if (typeof generatedText !== "string") {
      console.error("Generated text is not a string:", generatedText)
      throw new Error("Generated text is not a string")
    }

    const finalAnswerMarker = "Final Answer:"
    let reasoning = ""
    let answer = ""
    const finalAnswerIndex = generatedText.indexOf(finalAnswerMarker)
    if (finalAnswerIndex !== -1) {
      reasoning = generatedText.slice(0, finalAnswerIndex).trim()
      answer = generatedText.slice(finalAnswerIndex + finalAnswerMarker.length).trim()
    } else {
      answer = generatedText.trim()
    }

    // Replace any occurrence of "OpenAI" or "GPT" with "Eltek"
    answer = answer.replace(/OpenAI|GPT/g, "Eltek")
    reasoning = reasoning.replace(/OpenAI|GPT/g, "Eltek")

    return NextResponse.json({ answer, reasoning })
  } catch (error) {
    console.error("Error in generate route:", error)
    if (error instanceof Error) {
      console.error("Error message:", error.message)
      console.error("Error stack:", error.stack)
    }
    return NextResponse.json(
      { error: "An error occurred while processing your request. Please try again later." },
      { status: 500 },
    )
  }
}

