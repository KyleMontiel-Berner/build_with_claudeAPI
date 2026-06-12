import "dotenv/config";
import { Anthropic } from "@anthropic-ai/sdk";

const client = new Anthropic();
const model = "claude-sonnet-4-5";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const addUserMessage = (messages: Message[], text: string) => {
  messages.push({ role: "user", content: text });
};

const addAssistantMessage = (messages: Message[], text: string) => {
  messages.push({ role: "assistant", content: text });
};

const chat = async (messages: Message[]) => {
  const response = await client.messages.create({
    model: model,
    max_tokens: 1000,
    messages: messages,
  });
  const block = response.content[0];
  console.log("Received response:", block);
  if (block.type !== "text") {
    throw new Error(`Expected text block, got ${block.type}`);
  }
  return block.text;
};

const main = async () => {
  const messages: Message[] = [];

  addUserMessage(messages, "Define quantum computing in one sentence?");
  const answer = await chat(messages);
  addAssistantMessage(messages, answer);
  console.log("Messages1:", messages);

  addUserMessage(messages, "Write nother sentence");
  console.log("Messages2:", messages);
  const finalAnswer = await chat(messages);

  console.log(finalAnswer);
};

main();
