import fs from "fs";
import { chat, addUserMessage, MessageParam } from "./utils/chat";
import { EvalTask, DatasetSchema } from "./utils/generateDataset";

export type TestResult = {
  output: string;
  test_case: EvalTask;
  score: number;
};

export const runPrompt = async (testCase: EvalTask): Promise<string> => {
  const prompt = `
    Please solve the following task:
    ${testCase.task}`;

  const messages: MessageParam[] = [];
  addUserMessage(messages, prompt);
  const output = await chat(messages);
  return output;
};

export const runTestCase = async (testCase: EvalTask): Promise<TestResult> => {
  const output = await runPrompt(testCase);

  const score = 10;

  return {
    output,
    test_case: testCase,
    score,
  };
};

export const runEval = async (dataset: EvalTask[]): Promise<TestResult[]> => {
  const results: TestResult[] = [];

  for (const testCase of dataset) {
    const result = await runTestCase(testCase);
    results.push(result);
  }

  return results;
};

const main = async () => {
  const raw = JSON.parse(fs.readFileSync("dataset.json", "utf-8"));

  const dataset = DatasetSchema.parse(raw);

  const results = await runEval(dataset);

  console.log(JSON.stringify(results, null, 2));
};

main();
