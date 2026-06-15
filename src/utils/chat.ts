import Anthropic from "@anthropic-ai/sdk";
import "dotenv/config";

const client = new Anthropic();
const model = "claude-haiku-4-5";

export type MessageParam = Anthropic.MessageParam;

export const addUserMessage = (
  messages: MessageParam[],
  text: string,
): void => {
  messages.push({ role: "user", content: text });
};

export const addAssistantMessage = (
  messages: MessageParam[],
  text: string,
): void => {
  messages.push({ role: "assistant", content: text });
};

interface ChatOptions {
  system?: string;
  temperature?: number;
  stopSequences?: string[];
}

export async function chat(
  messages: MessageParam[],
  { system, temperature = 1.0, stopSequences = [] }: ChatOptions = {},
): Promise<string> {
  const message = await client.messages.create({
    model,
    max_tokens: 1000,
    messages,
    temperature,
    stop_sequences: stopSequences,
    ...(system ? { system } : {}),
  });

  const block = message.content[0];
  if (block.type !== "text") {
    throw new Error(`Expected a text block, got ${block.type}`);
  }
  return block.text;
}
