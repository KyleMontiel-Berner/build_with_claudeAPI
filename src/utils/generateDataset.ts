import {
  chat,
  addUserMessage,
  addAssistantMessage,
  MessageParam,
} from "./chat";
import { prompt } from "../evals/prompts";
import { z } from "zod";

const EvalTaskSchema = z.object({
  task: z.string(),
  format: z.enum(["javascript", "json", "regex"]),
  solutionCriteria: z.string(),
});
export const DatasetSchema = z.array(EvalTaskSchema);
export type EvalTask = z.infer<typeof EvalTaskSchema>;

export async function generateDataset(): Promise<EvalTask[]> {
  const messages: MessageParam[] = [];
  addUserMessage(messages, prompt);
  addAssistantMessage(messages, "```json");

  const text = await chat(messages, { stopSequences: ["```"] });
  return DatasetSchema.parse(JSON.parse(text));
}
