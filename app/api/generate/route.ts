import { NextResponse } from "next/server"
import { HfInference } from "@huggingface/inference"

const hf = new HfInference("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")
// Updated internal information now includes the current year 2025.
const ASSISTANT_INFO =
  "I am EltekAI, an assistant currently under development by Elly Logan at Eltek. The model you're using is called Juja, a research-focused language model developed by Eltek. Current year: 2025."

export async function POST(req: Request) {
  const { prompt, previousMessages } = await req.json()
  const trimmedPrompt = prompt.trim().toLowerCase()

  // Fixed responses for specific queries.
  if (trimmedPrompt === "what's your name?" || trimmedPrompt === "what is your name?") {
    return NextResponse.json({
      result: `My name is EltekAI. ${ASSISTANT_INFO}`
    })
  }
  
  if (
    trimmedPrompt === "which model are you?" ||
    trimmedPrompt === "which model are you" ||
    trimmedPrompt === "what model are you?" ||
    trimmedPrompt === "what model are you"
  ) {
    return NextResponse.json({
      result: "I am EltekAI, and I use Juja, a research-focused language model developed by Eltek."
    })
  }
  
  // Fixed response for queries about the specific model.
  if (trimmedPrompt.includes("specific model")) {
    return NextResponse.json({
      result: "The specific model of this assistant is Juja, a research-focused language model developed by Eltek, with Elly Logan as the current lead developer."
    })
  }
  
  if (
    trimmedPrompt === "who is the developer?" ||
    trimmedPrompt === "who is the developer" ||
    trimmedPrompt === "who developed you?" ||
    trimmedPrompt === "who developed you"
  ) {
    return NextResponse.json({
      result: "I am EltekAI, developed by Eltek, a Kenyan AI startup."
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
    "what's up?": "I'm here and ready to help! What can I do for you today?"
  }
  if (shortResponses[trimmedPrompt]) {
    return NextResponse.json({ result: shortResponses[trimmedPrompt] })
  }

  // Internal system instructions that should not be output.
  const systemInstructions = `${ASSISTANT_INFO}
Please provide a detailed chain-of-thought explanation in bullet points before giving your final answer. When finished, start your final answer with "Final Answer:". Do not include the above introduction in your answer.`

  // Build context prompt for detailed queries.
  let contextPrompt = ""
  if (previousMessages && previousMessages.length > 0) {
    const conversation = previousMessages.map((msg) => msg.content).join("\n")
    contextPrompt = `${systemInstructions}

You are an expert research assistant and content transformer. Your primary role is to convert lengthy research documents into engaging and accessible content. You can transform a 50-page research paper on climate change into a concise 2-page executive summary, generate a 15-minute podcast transcript from a detailed economics paper, or create a visually engaging presentation outline that highlights key insights. Your answers should be detailed, comprehensive, and tailored for a student audience using the latest research information available as of 2025.

Previous conversation:
${conversation}

Question: ${prompt}

Reasoning:
`
  } else {
    contextPrompt = `${systemInstructions}

You are an expert research assistant and content transformer. Your primary role is to convert lengthy research documents into engaging and accessible content. You can transform a 50-page research paper on climate change into a concise 2-page executive summary, generate a 15-minute podcast transcript from a detailed economics paper, or create a visually engaging presentation outline that highlights key insights. Your answers should be detailed, comprehensive, and tailored for a student audience using the latest research information available as of 2025.

Question: ${prompt}

Reasoning:
`
  }

  try {
    const response = await hf.textGeneration({
      model: "mistralai/Mistral-7B-Instruct-v0.3",
      inputs: contextPrompt,
      parameters: {
        max_new_tokens: 500,  // Increased token limit for comprehensive answers.
        temperature: 0.2,     // Lower randomness for more factual responses.
        top_p: 0.8,           // Focus on high-probability tokens.
        top_k: 20,            // Limit to the top 20 tokens.
        repetition_penalty: 1.2 // Discourage repetition.
      },
    })

    let outputText = response.generated_text;

    // Optimize output: Remove any content before the "Reasoning:" marker.
    const reasoningMarker = "Reasoning:";
    const reasoningMarkerIndex = outputText.indexOf(reasoningMarker);
    if (reasoningMarkerIndex !== -1) {
      outputText = outputText.slice(reasoningMarkerIndex + reasoningMarker.length).trim();
    }

    // Now separate the hidden reasoning and final answer using the "Final Answer:" marker.
    const finalAnswerMarker = "Final Answer:";
    let reasoningText = "";
    let finalAnswer = "";
    const finalAnswerIndex = outputText.indexOf(finalAnswerMarker);
    if (finalAnswerIndex !== -1) {
      reasoningText = outputText.slice(0, finalAnswerIndex).trim();
      finalAnswer = outputText.slice(finalAnswerIndex + finalAnswerMarker.length).trim();
    } else {
      finalAnswer = outputText.trim();
    }

    // Replace any occurrence of "Mistral AI" with "Eltek"
    finalAnswer = finalAnswer.replace(/Mistral AI/g, "Eltek");
    reasoningText = reasoningText.replace(/Mistral AI/g, "Eltek");

    // Remove trailing descriptive phrases mentioning a European company.
    finalAnswer = finalAnswer.replace(/,?\s*a leading European company[^.]*\./gi, "");
    reasoningText = reasoningText.replace(/,?\s*a leading European company[^.]*\./gi, "");

    return NextResponse.json({ result: finalAnswer, reasoning: reasoningText });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "An error occurred while processing your request." }, { status: 500 });
  }
}

