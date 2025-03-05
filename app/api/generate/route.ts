import { NextResponse } from "next/server";
import { HfInference } from "@huggingface/inference";

const hf = new HfInference("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");
const ASSISTANT_INFO =
  "I am EltekAI, an assistant currently under development by Elly Logan at Eltek. The model you're using is called Juja, a research-focused language model developed by Eltek. Current year: 2025.";

export async function POST(req: Request) {
  const { prompt, previousMessages } = await req.json();
  const trimmedPrompt = prompt.trim().toLowerCase();

  // Fixed responses for specific queries.
  const fixedResponses: Record<string, string> = {
    "what's your name?": `My name is EltekAI. ${ASSISTANT_INFO}`,
    "what is your name?": `My name is EltekAI. ${ASSISTANT_INFO}`,
    "which model are you?": "I am EltekAI, and I use Juja, a research-focused language model developed by Eltek.",
    "who is the developer?": "I am EltekAI, developed by Eltek, a Kenyan AI startup.",
    "who developed you?": "I am EltekAI, developed by Eltek, a Kenyan AI startup.",
  };
  
  if (fixedResponses[trimmedPrompt]) {
    return NextResponse.json({ result: fixedResponses[trimmedPrompt] });
  }

  // Short, common responses.
  const shortResponses: Record<string, string> = {
    hi: "Hello! I'm EltekAI, your research assistant. How can I help you today?",
    hello: "Hello! I'm EltekAI, your research assistant. How can I help you today?",
    hey: "Hello! I'm EltekAI, your research assistant. How can I help you today?",
    thanks: "You're welcome!",
    "thank you": "You're welcome!",
    bye: "Goodbye! Have a great day!",
    goodbye: "Goodbye! Have a great day!",
  };
  
  if (shortResponses[trimmedPrompt]) {
    return NextResponse.json({ result: shortResponses[trimmedPrompt] });
  }

  // Limit conversation history to last 3 messages to reduce token usage.
  const recentMessages = previousMessages?.slice(-3).map((msg) => msg.content).join("\n") || "";

  const contextPrompt = `${ASSISTANT_INFO}

Previous conversation:
${recentMessages}

Question: ${prompt}

Reasoning:
`;

  try {
    const response = await hf.textGeneration({
      model: "mistralai/Mistral-7B-Instruct-v0.3",
      inputs: contextPrompt,
      parameters: {
        max_new_tokens: 250, // Reduced from 500 to save credits
        temperature: 0.5, // Increased slightly for concise responses
        top_p: 0.8,
        top_k: 20,
        repetition_penalty: 1.2,
        use_cache: true, // Enable caching to avoid redundant requests
      },
      options: {
        use_cache: true,
        wait_for_model: true, // Avoids issues with cold-started models
      },
    });

    const generatedText = response.generated_text;
    const finalAnswerMarker = "Final Answer:";
    let reasoning = "";
    let answer = "";
    const finalAnswerIndex = generatedText.indexOf(finalAnswerMarker);

    if (finalAnswerIndex !== -1) {
      reasoning = generatedText.slice(0, finalAnswerIndex).trim();
      answer = generatedText.slice(finalAnswerIndex + finalAnswerMarker.length).trim();
    } else {
      answer = generatedText.trim();
    }

    // Ensure the question is not repeated in the final answer.
    answer = answer.replace(`Question: ${prompt}`, "").trim();

    // Replace occurrences of "Mistral AI" with "Eltek"
    answer = answer.replace(/Mistral AI/g, "Eltek");
    reasoning = reasoning.replace(/Mistral AI/g, "Eltek");

    return NextResponse.json({ reasoning, answer });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "An error occurred while processing your request." }, { status: 500 });
  }
}
