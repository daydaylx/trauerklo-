import { db } from "../../db/dexie";
import type { Message } from "../../types/core";
import { chatOnce } from "../../services/openrouter";
import { detectEmotion } from "../emotion/heuristics";

export async function sendMessage(userText: string, onStream?: (t: string)=>void) {
  const msgUser: Message = { id: crypto.randomUUID(), role: "user", text: userText, ts: Date.now() };
  await db.messages.add(msgUser);

  let acc = "";
  try {
    const text = await chatOnce(userText, { onToken: (t) => { acc += t; onStream?.(t); } });
    const msgAI: Message = { id: crypto.randomUUID(), role: "assistant", text, ts: Date.now() };
    await db.messages.add(msgAI);
    return { text, emotion: detectEmotion(text) };
  } catch (e:any) {
    const fallback = "Bin grad etwas daneben – sag's nochmal in anderen Worten?";
    const msgAI: Message = { id: crypto.randomUUID(), role: "assistant", text: fallback, ts: Date.now() };
    await db.messages.add(msgAI);
    return { text: fallback, emotion: "meh" as const };
  }
}

export async function getRecentMessages(limit=50): Promise<Message[]> {
  return db.messages.orderBy("ts").reverse().limit(limit).toArray().then(a => a.reverse());
}
