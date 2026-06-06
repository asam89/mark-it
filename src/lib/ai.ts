import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";

export type LLMProvider = "openai" | "anthropic";

function getProvider(): LLMProvider {
  return (process.env.LLM_PROVIDER as LLMProvider) || "openai";
}

function getOpenAI() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "" });
}

function getAnthropic() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || "" });
}

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function* streamChat(
  messages: ChatMessage[],
  systemPrompt: string
): AsyncGenerator<string> {
  const provider = getProvider();

  if (provider === "anthropic") {
    const anthropic = getAnthropic();
    const stream = anthropic.messages.stream({
      model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-20250514",
      max_tokens: 2048,
      system: systemPrompt,
      messages: messages
        .filter((m) => m.role !== "system")
        .map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
    });

    for await (const event of stream) {
      if (
        event.type === "content_block_delta" &&
        event.delta.type === "text_delta"
      ) {
        yield event.delta.text;
      }
    }
  } else {
    const openai = getOpenAI();
    const stream = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o",
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      stream: true,
    });

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content;
      if (delta) yield delta;
    }
  }
}

export async function generateJSON<T>(
  messages: ChatMessage[],
  systemPrompt: string
): Promise<T> {
  const provider = getProvider();

  if (provider === "anthropic") {
    const anthropic = getAnthropic();
    const response = await anthropic.messages.create({
      model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: systemPrompt,
      messages: messages
        .filter((m) => m.role !== "system")
        .map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";
    return JSON.parse(text) as T;
  } else {
    const openai = getOpenAI();
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o",
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content || "{}") as T;
  }
}
