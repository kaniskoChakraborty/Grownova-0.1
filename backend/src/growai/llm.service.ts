import { Injectable } from '@nestjs/common';

// The only place that talks to a hosted LLM. Swapping providers means changing complete() only.
@Injectable()
export class LlmService {
  private readonly apiKey = process.env.ANTHROPIC_API_KEY;
  private readonly model = process.env.LLM_MODEL ?? 'claude-haiku-5-5';

  /** False when no key is set or LLM_PROVIDER=mock; callers then use their rules fallback. */
  get enabled(): boolean {
    return Boolean(this.apiKey) && process.env.LLM_PROVIDER !== 'mock';
  }

  async complete(system: string, prompt: string): Promise<string> {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': this.apiKey!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: 400,
        system,
        messages: [{ role: 'user', content: prompt }],
      }),
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) throw new Error(`LLM request failed: HTTP ${res.status}`);
    const data = (await res.json()) as { content?: { type: string; text?: string }[] };
    return data.content?.find((c) => c.type === 'text')?.text ?? '';
  }
}
