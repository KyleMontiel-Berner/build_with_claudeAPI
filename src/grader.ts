import {
  chat,
  addUserMessage,
  addAssistantMessage,
  MessageParam,
} from "./utils/chat";
import { EvalTask } from "./utils/generateDataset";
import { z } from "zod";

const GradeSchema = z.object({
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  reasoning: z.string(),
  score: z.number(),
});

export type Grade = z.infer<typeof GradeSchema>;

export const gradeFromModel = async (
  testCase: EvalTask,
  output: string,
): Promise<Grade> => {
  const evalPrompt = `You are an expert code reviewer. Evaluate this AI-generated solution.
 
Task: 
<task>
${testCase.task}
</task>

Solution to Evaluate:
<solution>
${output}
</solution>

Criteria you should use to evaluate the solution:
<criteria>
${testCase.solutionCriteria}
</criteria>
 
Provide your evaluation as a structured JSON object with:
- "strengths": An array of 1-3 key strengths
- "weaknesses": An array of 1-3 key areas for improvement
- "reasoning": A concise explanation of your assessment
- "score": A number between 1-10
`;

  const messages: MessageParam[] = [];
  addUserMessage(messages, evalPrompt);
  addAssistantMessage(messages, "```json");

  const evalText = await chat(messages, { stopSequences: ["```"] });
  return GradeSchema.parse(JSON.parse(evalText));
};
