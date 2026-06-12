import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();
const model = "claude-sonnet-4-5";

type Message = { role: "user" | "assistant"; content: string };

const chat = async (
  messages: Message[],
  stopSequences?: string[],
): Promise<string> => {
  const response = await client.messages.create({
    model,
    max_tokens: 1000,
    messages,
    ...(stopSequences && { stop_sequences: stopSequences }),
  });

  const block = response.content.find((block) => block.type === "text");
  return block && block.type === "text" ? block.text : "";
};

const main = async () => {
  const messages: Message[] = [];

  messages.push({
    role: "user",
    content:
      "Generate 3 different sample AWS CLI commands. Each should be very short.",
  });

  messages.push({
    role: "assistant",
    content: "```bash",
  });

  const response = await chat(messages, ["```"]);

  console.log(response);
};

main();
