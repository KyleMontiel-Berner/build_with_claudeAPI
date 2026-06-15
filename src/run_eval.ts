import fs from "fs";
import {
  chat,
  addUserMessage,
  MessageParam,
  addAssistantMessage,
} from "./utils/chat";
import { gradeSyntax } from "./utils/validators";
import { EvalTask, DatasetSchema } from "./utils/generateDataset";
import { gradeFromModel } from "./grader";

export type TestResult = {
  output: string;
  test_case: EvalTask;
  score: number;
  reasoning: string;
};

export const runPrompt = async (testCase: EvalTask): Promise<string> => {
  const prompt = `
    Please solve the following task:
    ${testCase.task}
    * Respond only with Javascript, JSON, or a plain Regex
    * Do not add any comments or commentary or explanation`;

  const messages: MessageParam[] = [];
  addUserMessage(messages, prompt);
  addAssistantMessage(messages, `\`\`\`${testCase.format}`);
  const output = await chat(messages, { stopSequences: ["```"] });
  return output;
};

export const runTestCase = async (testCase: EvalTask): Promise<TestResult> => {
  const output = await runPrompt(testCase);
  const modelGrade = await gradeFromModel(testCase, output);
  const modelScore = modelGrade.score;
  const reasoning = modelGrade.reasoning;

  const syntaxScore = gradeSyntax(output, testCase);

  const score = (modelScore + syntaxScore) / 2;

  return {
    output,
    test_case: testCase,
    score,
    reasoning,
  };
};

export const runEval = async (dataset: EvalTask[]): Promise<TestResult[]> => {
  const results: TestResult[] = [];

  for (const testCase of dataset) {
    const result = await runTestCase(testCase);
    results.push(result);
  }

  const averageScore =
    results.reduce((sum, curr) => sum + curr.score, 0) / results.length;

  console.log(`Average score: ${averageScore}`);

  return results;
};

const main = async () => {
  const raw = JSON.parse(fs.readFileSync("dataset.json", "utf-8"));

  const dataset = DatasetSchema.parse(raw);

  const results = await runEval(dataset);

  console.log(JSON.stringify(results, null, 2));
};

main();
