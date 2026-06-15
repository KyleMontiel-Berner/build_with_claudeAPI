import { EvalTask } from "./generateDataset";

export const validateJSON = (text: string): number => {
  try {
    JSON.parse(text.trim());
    return 10;
  } catch {
    return 0;
  }
};

export const validateRegex = (text: string): number => {
  try {
    new RegExp(text.trim());
    return 10;
  } catch {
    return 0;
  }
};

export const validateJavascript = (text: string): number => {
  try {
    new Function(text.trim());
    return 10;
  } catch {
    return 0;
  }
};

export const gradeSyntax = (output: string, testCase: EvalTask): number => {
  switch (testCase.format) {
    case "json":
      return validateJSON(output);
    case "javascript":
      return validateJavascript(output);
    case "regex":
      return validateRegex(output);
    default:
      return 0;
  }
};
