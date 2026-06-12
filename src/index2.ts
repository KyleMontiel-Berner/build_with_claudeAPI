import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";
import * as readline from "readline";

const client = new Anthropic();
const model = "claude-sonnet-4-5";

type Message = { role: "user" | "assistant"; content: string };

const addUserMessage = (messages: Message[], text: string): void => {
  messages.push({ role: "user", content: text });
};

const addAssistantMessage = (messages: Message[], text: string): void => {
  messages.push({ role: "assistant", content: text });
};

const chat = async (messages: Message[]): Promise<string> => {
  const response = await client.messages.create({
    model,
    max_tokens: 1000,
    messages,
  });
  const block = response.content[0];
  if (block.type !== "text") throw new Error("Unexpected response type");
  return block.text;
};

// Wraps readline in a Promise so you can await it like Python's input()
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
  console.log('Chatbot ready. Type "exit" to quit.\n');

  while (true) {
    const userInput = await getUserInput("You: ");

    if (userInput.toLowerCase() === "exit") break;

    addUserMessage(messages, userInput);
    const response = await chat(messages);
    addAssistantMessage(messages, response);

    console.log(`\nClaude: ${response}\n`);
  }
};

main();
