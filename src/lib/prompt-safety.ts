import { PROMPT_INJECTION_PATTERNS } from './prompt-injection-patterns';

export const sanitizeForPrompt = (value: string): string =>
  value
    .replace(/[`]/g, "'")
    .replace(/\s+/g, ' ')
    .trim();

export const containsPromptInjection = (
  values: Array<string | undefined>
): boolean => {
  for (const rawValue of values) {
    if (!rawValue) continue;

    const value = rawValue.toLowerCase();

    for (const pattern of PROMPT_INJECTION_PATTERNS) {
      if (pattern.test(value)) {
        return true;
      }
    }
  }

  return false;
};
