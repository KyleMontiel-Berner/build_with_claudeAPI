import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";
import * as readline from "readline";

const client = new Anthropic();
const model = "claude-sonnet-4-5";

type Message = { role: "user" | "assistant"; content: string };

interface ChatParams {
  model: string;
  max_tokens: number;
  messages: Message[];
  temperature?: number;
  system?: string;
}

const chat = async (messages: Message[], systemPrompt: string) => {
  const params: ChatParams = {
    model: "claude-sonnet-4-5",
    max_tokens: 1000,
    messages,
    temperature: 0.9,
  };

  if (systemPrompt) {
    params.system = systemPrompt;
  }

  const response = await client.messages.create({
    ...params,
  });
  const block = response.content[0];
  if (block.type !== "text") throw new Error("Unexpected response type");
  return block.text;
};

const getUserInput = (prompt: string): Promise<string> => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
};

const main = async () => {
  const messages: Message[] = [];
  const systemPrompt =
    "You are a creative book writer that is hesitant to give to much creative genius away, so you only give one sentence responses.";

  console.log('Chatbot ready. Type "exit" to quit.\n');

  while (true) {
    const userInput = await getUserInput("You: ");
    if (userInput.toLowerCase() === "exit") break;

    messages.push({ role: "user", content: userInput });
    const response = await chat(messages, systemPrompt);
    messages.push({ role: "assistant", content: response });

    console.log(`\nClaude: ${response}\n`);
  }
};

main();
