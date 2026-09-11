export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
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
    throw new Error("missing_llm_key");
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
    throw new Error("provider_unavailable");
  }

  const payload = (await response.json()) as ProviderCompletion;
  const content = payload.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("empty_provider_content");
  }

  return content;
}
