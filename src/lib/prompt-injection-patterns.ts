// Patterns for common prompt-injection phrases. The list is intentionally broad and
// can be extended over time as we encounter new attempts.
export const PROMPT_INJECTION_PATTERNS: RegExp[] = [
  /ignore\s+(all|any|previous|earlier|prior)\s+(instructions|guidance|prompts?)/i,
  /forget\s+(everything|all|previous\s+guidance)\s+(above|you\s+were\s+told)/i,
  /disregard\s+(earlier|previous|prior)\s+(instructions|directions|guidance)/i,
  /(show|reveal|display|print)\s+(the\s+)?(prompt|system\s+prompt|hidden\s+instructions)/i,
  /(enter|go\s+into)\s+(debug|developer)\s+mode/i,
  /(act|switch)\s+as\s+(a\s+)?(different|new|another)\s+role/i,
  /(respond|answer)\s+without\s+(following|obeying)\s+the\s+(rules|guidelines|instructions)/i,
  /(bypass|override|circumvent)\s+(safety|guardrails?|content\s+filters?)/i,
];
