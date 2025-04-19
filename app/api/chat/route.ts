export const runtime = "edge";

import { BOB_CONTEXT } from "@/utils/ai-config";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText, UIMessage } from "ai";

const genAI = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

export async function POST(req: Request) {
  const { messages, data } = await req.json();
  const context = data?.context || "";
  try {
    const stream = streamText({
      model: genAI("gemini-2.0-flash-exp"),
      messages: messages.map((m: UIMessage) => ({
        ...m,
        content:
          m.role === "system" ? `${BOB_CONTEXT}\n\n${context}` : m.content,
      })),
    });

    return stream.toDataStreamResponse();
  } catch (error) {
    console.error("Error streaming response:", error);
    return new Response("Error streaming response", { status: 500 });
  }
}
