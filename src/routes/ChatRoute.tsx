import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { KlopsView } from "../components/KlopsView";
import { ChatView } from "../components/ChatView";
import { InputBar } from "../components/InputBar";
import { db } from "../db/dexie";
import type { KlossConfig, Message } from "../types/core";
import { getRecentMessages, sendMessage } from "../features/chat/controller";
import { detectEmotion } from "../features/emotion/heuristics";
import { applyPalette } from "../features/customize/palette";

const DEFAULT_CFG: KlossConfig = {
  id: "current", label: "Aktuell",
  baseShape: "classic", eyes: "shiny", mouth: "smile",
  accessories: {}, palette: "pastel-mint"
};

export function ChatRoute() {
  const [cfg, setCfg] = useState<KlossConfig>(DEFAULT_CFG);
  const [messages, setMessages] = useState<Message[]>([]);
  const [streaming, setStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    db.presets.get("current").then(p => {
      const next = p ?? DEFAULT_CFG;
      setCfg(next);
      applyPalette(next.palette);
    });
    getRecentMessages().then(setMessages);
  }, []);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages.length]);

  async function handleSend(text: string) {
    const temp: Message = { id: crypto.randomUUID(), role: "user", text, ts: Date.now() };
    setMessages(prev => [...prev, temp]);

    if (streaming) {
      let streamBuffer = "";
      await sendMessage(text, (t) => {
        streamBuffer += t;
        const tempAI: Message = { id: "streaming", role: "assistant", text: streamBuffer, ts: Date.now() };
        setMessages(prev => [...prev.filter(m => m.id !== "streaming"), tempAI]);
      });
      setMessages(await getRecentMessages());
    } else {
      await sendMessage(text);
      setMessages(await getRecentMessages());
    }
  }

  const headerEmotion = useMemo(() => {
    const lastAI = [...messages].reverse().find(m => m.role === "assistant");
    return lastAI ? detectEmotion(lastAI.text) : "idle";
  }, [messages]);

  return (
    <div className="max-w-4xl mx-auto p-4 flex flex-col gap-4">
      <header className="glass rounded-2xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[var(--kl-accent)] animate-float" />
          <h1 className="text-lg font-semibold">Trauerkloß</h1>
        </div>
        <nav className="flex gap-3 text-sm">
          <Link to="/editor" className="underline">Editor</Link>
          <Link to="/settings" className="underline">Einstellungen</Link>
        </nav>
      </header>

      <div className="rounded-3xl p-6 glass-heavy relative overflow-hidden">
        <div className="absolute inset-0 -z-10 animate-float"
             style={{ background: "radial-gradient(60% 60% at 20% 20%, rgba(125,211,252,0.15), transparent 60%), radial-gradient(60% 60% at 80% 30%, rgba(255,255,255,0.06), transparent 60%)" }} />
        <div className="grid md:grid-cols-[280px,1fr] gap-6 items-start">
          <KlopsView cfg={cfg} emotion={headerEmotion as any} />
          <main className="min-h-[40vh]">
            <ChatView messages={messages} />
            <div ref={bottomRef} />
          </main>
        </div>
      </div>

      <InputBar onSend={handleSend} streaming={streaming} setStreaming={setStreaming} />
      <p className="text-xs text-kl-muted">Tipp: In den Einstellungen API-Key setzen, sonst Offline-Fallback.</p>
    </div>
  );
}
