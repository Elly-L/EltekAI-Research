import { NextResponse } from "next/server";

// Read the API key and endpoint from environment variables
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_API_URL = process.env.OPENROUTER_API_URL || "https://openrouter.ai/api/v1/chat/completions";

const ASSISTANT_INFO =
  "I am EltekAI, an assistant currently under development by Elly Logan at Eltek. The model you're using is called Juja, a research-focused language model developed by Eltek. Current year: 2025.";

export async function POST(req: Request) {
  try {
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
    const recentMessages = previousMessages
      ?.slice(-3)
      .map((msg: any) => msg.content)
      .join("\n") || "";

    const contextPrompt = `${ASSISTANT_INFO}

Previous conversation:
${recentMessages}

Question: ${prompt}

Reasoning:
`;

    // Prepare the payload according to OpenRouter's API format
    const payload = {
      model: "mistralai/mistral-small-24b-instruct-2501:free",
      inputs: contextPrompt,
      parameters: {
        max_new_tokens: 250,
        temperature: 0.5,
        top_p: 0.8,
        top_k: 20,
        repetition_penalty: 1.2,
        use_cache: true,
      },
      options: {
        use_cache: true,
        wait_for_model: true,
      },
    };

    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      // Log and return error details for debugging
      const errorData = await response.json();
      console.error("Error from OpenRouter:", errorData);
      return NextResponse.json(
        { error: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Extract generated text.
    const generatedText = data.choices?.[0]?.message?.content || "";

    // Split reasoning and answer if possible.
    const finalAnswerMarker = "Final Answer:";
    let reasoningText = "";
    let answerText = "";
    const markerIndex = generatedText.indexOf(finalAnswerMarker);

    if (markerIndex !== -1) {
      reasoningText = generatedText.slice(0, markerIndex).trim();
      answerText = generatedText
        .slice(markerIndex + finalAnswerMarker.length)
        .trim();
    } else {
      answerText = generatedText.trim();
    }

    // Remove repeated question if any.
    answerText = answerText.replace(`Question: ${prompt}`, "").trim();

    // Replace any occurrences of "Mistral AI" with "Eltek"
    answerText = answerText.replace(/Mistral AI/g, "Eltek");
    reasoningText = reasoningText.replace(/Mistral AI/g, "Eltek");

    return NextResponse.json({ reasoning: reasoningText, answer: answerText });
  } catch (error: any) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request." },
      { status: 500 }
    );
  }
}
