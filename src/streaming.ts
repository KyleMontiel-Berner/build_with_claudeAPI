import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";
import * as readline from "readline";

const client = new Anthropic();
const model = "claude-sonnet-4-5";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const chat = async (messages: Message[]): Promise<string> => {
  const stream = client.messages.stream({
    model,
    max_tokens: 1000,
    messages,
  });

  stream.on("text", (text) => {
    process.stdout.write(text);
  });

  const message = await stream.finalMessage();
  console.log();

  const textBlock = message.content.find((block) => block.type === "text");
  return textBlock && textBlock.type === "text" ? textBlock.text : "";
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
  console.log('Chatbot ready. Type "exit" to quit.\n');

  while (true) {
    const userInput = await getUserInput("You: ");
    if (userInput.toLowerCase() === "exit") break;

    messages.push({ role: "user", content: userInput });
    const response = await chat(messages);
    messages.push({ role: "assistant", content: response });
  }
};

main();
