import { useEffect, useRef, useState } from "react";

type Props = {
  onSend: (text: string) => Promise<void>|void;
  streaming: boolean;
  setStreaming: (v: boolean) => void;
};

export function InputBar({ onSend, streaming, setStreaming }: Props) {
  const [text, setText] = useState("");
  const taRef = useRef<HTMLTextAreaElement>(null);

  async function submit(e?: React.FormEvent) {
    e?.preventDefault();
    const t = text.trim();
    if (!t) return;
    setText("");
    await onSend(t);
  }

  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "0px";
    ta.style.height = Math.min(140, ta.scrollHeight) + "px";
  }, [text]);

  return (
    <form onSubmit={submit} className="glass rounded-2xl px-3 py-2 flex items-end gap-2">
      <textarea
        ref={taRef}
        rows={1}
        value={text}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); }
        }}
        onChange={(e) => setText(e.target.value)}
        placeholder="Sag was zum Trauerkloß… (Shift+Enter für Zeilenumbruch)"
        className="flex-1 resize-none bg-transparent outline-none text-[15px] leading-6 placeholder:text-kl-muted"
      />
      <label className="flex items-center gap-2 text-xs text-kl-muted select-none mr-2">
        <input type="checkbox" checked={streaming} onChange={(e)=>setStreaming(e.target.checked)} />
        Streaming
      </label>
      <button type="submit" className="btn-accent">Senden</button>
    </form>
  );
}
