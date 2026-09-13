export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export type LlmFailureCategory =
  | "missing_llm_key"
  | "provider_unavailable"
  | "empty_provider_content"
  | "timeout"
  | "invalid_json"
  | "schema_invalid"
  | "request_aborted";

export class LlmProviderError extends Error {
  readonly category: LlmFailureCategory;
  readonly httpStatus?: number;

  constructor(category: LlmFailureCategory, httpStatus?: number) {
    super(category);
    this.name = "LlmProviderError";
    this.category = category;
    this.httpStatus = httpStatus;
  }
}

export function llmEnvConfiguredStatus(): {
  LLM_API_KEY: "configured" | "missing";
  LLM_BASE_URL: "configured" | "missing";
  LLM_MODEL: "configured" | "missing";
} {
  return {
    LLM_API_KEY: process.env.LLM_API_KEY ? "configured" : "missing",
    LLM_BASE_URL: process.env.LLM_BASE_URL ? "configured" : "missing",
    LLM_MODEL: process.env.LLM_MODEL ? "configured" : "missing",
  };
}

interface ProviderCompletion {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
}

export async function completeChat(messages: ChatMessage[]): Promise<string> {
  const apiKey = process.env.LLM_API_KEY;
  if (!apiKey) {
    throw new LlmProviderError("missing_llm_key");
  }

  const baseUrl = (process.env.LLM_BASE_URL ?? "https://api.openai.com/v1").replace(
    /\/$/,
    "",
  );
  const model = process.env.LLM_MODEL ?? "gpt-4o-mini";

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.3,
      response_format: { type: "json_object" },
      messages,
    }),
  });

  if (!response.ok) {
    throw new LlmProviderError("provider_unavailable", response.status);
  }

  const payload = (await response.json()) as ProviderCompletion;
  const content = payload.choices?.[0]?.message?.content;
  if (!content) {
    throw new LlmProviderError("empty_provider_content", response.status);
  }

  return content;
}
