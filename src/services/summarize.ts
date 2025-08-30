import type { Message } from "../types/core";

export function needsSummary(history: Message[]): boolean {
  return history.length >= 12;
}

export function summarize(history: Message[]): string {
  // Primitive, aber deterministisch: letzte 8 Nachrichten kondensieren
  const last = history.slice(-8).map(m => `${m.role === "user" ? "N:" : "K:"} ${m.text}`);
  const s = last.join(" | ").slice(0, 200);
  return s;
}
