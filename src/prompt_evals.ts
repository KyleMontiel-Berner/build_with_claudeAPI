import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { writeFile } from "node:fs/promises";
import { prompt } from "./evals/prompts";

const client = new Anthropic();
const model = "claude-haiku-4-5";

type MessageParam = Anthropic.MessageParam;

const addUserMessage = (messages: MessageParam[], text: string): void => {
  messages.push({ role: "user", content: text });
};

const addAssistantMessage = (messages: MessageParam[], text: string): void => {
  messages.push({ role: "assistant", content: text });
};

interface ChatOptions {
  system?: string;
  temperature?: number;
  stopSequences?: string[];
}

async function chat(
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

const EvalTaskSchema = z.object({ task: z.string() });
const DatasetSchema = z.array(EvalTaskSchema);
type EvalTask = z.infer<typeof EvalTaskSchema>;

async function generateDataset(): Promise<EvalTask[]> {
  const messages: MessageParam[] = [];
  addUserMessage(messages, prompt);
  addAssistantMessage(messages, "```json");

  const text = await chat(messages, { stopSequences: ["```"] });
  return DatasetSchema.parse(JSON.parse(text));
}

async function main(): Promise<void> {
  const dataset = await generateDataset();
  console.log(dataset);

  await writeFile("dataset.json", JSON.stringify(dataset, null, 2));
  console.log("Wrote dataset.json");
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
