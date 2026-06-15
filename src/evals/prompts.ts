export const prompt = `
Generate a evaluation dataset for a prompt evaluation. The dataset will be used to evaluate prompts
that generate Javascript, JSON, or Regex specifically for AWS-related tasks. Generate an array of JSON objects,
each representing task that requires Javascript, JSON, or a Regex to complete.

Example output:
\`\`\`json
[
    {
        "task": "Description of task",
        "format": "javascript",
        "solutionCriteria: "Key criteria for evaluating the solution"
    },
    ...additional
]
\`\`\`

* Focus on tasks that can be solved by writing a single Javascript function, a single JSON object, or a regular expression.
* Focus on tasks that do not require writing much code

Please generate 3 objects.
`;
