import type { Message, Settings } from "../types/core";
import { db, getSettings } from "../db/dexie";

type ORMessage = { role: "system"|"user"|"assistant"; content: string };

const SYSTEM_PROMPT =
  "Du bist Trauerklops, ein freundlicher, leicht sarkastischer Blob. " +
  "Antworte kurz (max. 2–3 Sätze), warm, alltagsnah. Keine Diagnosen, keine Moralpredigten. " +
  "Emojis sparsam. Bei Mini-Inputs: 1 Satz + kurze Rückfrage.";

function toORMessages(history: Message[], summary: string | null): ORMessage[] {
  const msgs: ORMessage[] = [{ role: "system", content: SYSTEM_PROMPT + (summary ? `\nZusammenfassung: ${summary}` : "") }];
  for (const m of history) {
    msgs.push({ role: m.role, content: m.text } as ORMessage);
  }
  return msgs;
}

export async function getActiveSettings(): Promise<Settings> {
  const s = await getSettings();
  if (!s || !s.apiKey) throw new Error("API-Key fehlt. Öffne Einstellungen.");
  return s;
}

export async function chatOnce(
  userText: string,
  opts?: { onToken?: (t: string) => void }
): Promise<string> {
  const s = await getActiveSettings();
  const history = await db.messages.orderBy("ts").toArray();
  const last = history.slice(-10);
  const summaries = await db.summaries.orderBy("ts").toArray();
  const summary = summaries.length ? summaries[summaries.length - 1].text : null;

  const payload = {
    model: s.modelId || "openrouter/auto",
    messages: toORMessages(last, summary).concat([{ role: "user", content: userText }]),
    max_tokens: s.tokenCapPerMsg || 160,
    temperature: 0.7,
    stream: Boolean(s.streaming)
  };

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + s.apiKey
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    // retry einmal bei 5xx/429
    if (res.status >= 500 || res.status === 429) {
      const retry = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + s.apiKey
        },
        body: JSON.stringify(payload)
      });
      if (!retry.ok) throw new Error(`OpenRouter Fehler: ${retry.status}`);
      return handleResponse(retry, Boolean(s.streaming), opts?.onToken);
    }
    throw new Error(`OpenRouter Fehler: ${res.status}`);
  }

  return handleResponse(res, Boolean(s.streaming), opts?.onToken);
}

async function handleResponse(res: Response, streaming: boolean, onToken?: (t: string) => void): Promise<string> {
  if (!streaming) {
    const data = await res.json();
    const text = data.choices?.[0]?.message?.content ?? "";
    return String(text);
  }

  // Streaming: SSE Zeilen "data: {...}" bis [DONE]
  const reader = res.body!.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "", out = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let idx;
    while ((idx = buffer.indexOf("\n")) >= 0) {
      const line = buffer.slice(0, idx).trim();
      buffer = buffer.slice(idx + 1);
      if (!line.startsWith("data:")) continue;
      const json = line.slice(5).trim();
      if (json === "[DONE]") { reader.cancel(); break; }
      try {
        const chunk = JSON.parse(json);
        const delta = chunk.choices?.[0]?.delta?.content ?? "";
        if (delta) {
          out += delta;
          onToken?.(delta);
        }
      } catch {}
    }
  }
  return out;
}
