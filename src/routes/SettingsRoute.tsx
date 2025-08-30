import { useEffect, useState } from "react";
import type { Settings } from "../types/core";
import { db } from "../db/dexie";
import { exportAll, importAll } from "../services/storage";
import { Link } from "react-router-dom";

const DEFAULT: Settings = {
  apiKey: "",
  modelId: "openrouter/auto",
  streaming: false,
  tokenCapPerMsg: 160,
  dailyTokenCap: 1500,
  language: "de",
  theme: "system",
  resetDaily: true,
  haptics: false
};

export function SettingsRoute() {
  const [s, setS] = useState<Settings>(DEFAULT);

  useEffect(() => {
    db.settings.toArray().then(a => setS(a[0] ?? DEFAULT));
  }, []);

  async function save() {
    await db.settings.clear();
    await db.settings.add(s);
    alert("Gespeichert.");
  }

  async function doExport() {
    const blob = await exportAll();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "trauerkloß-export.json"; a.click();
  }
  async function doImport(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    await importAll(f);
    alert("Import OK – Seite neu laden.");
  }

  return (
    <div className="max-w-xl mx-auto p-4 flex flex-col gap-4">
      <header className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Einstellungen</h1>
        <nav className="flex gap-3 text-sm">
          <Link to="/" className="underline">Chat</Link>
          <Link to="/editor" className="underline">Editor</Link>
        </nav>
      </header>

      <label className="flex flex-col gap-1">
        <span className="text-sm text-kl-muted">OpenRouter API-Key</span>
        <input className="bg-[#0b0e12] border border-[#1f2937] rounded-lg px-3 py-2"
          value={s.apiKey} onChange={(e)=>setS({...s, apiKey: e.target.value})} placeholder="sk-or-v1-..." />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm text-kl-muted">Modell-ID</span>
        <input className="bg-[#0b0e12] border border-[#1f2937] rounded-lg px-3 py-2"
          value={s.modelId} onChange={(e)=>setS({...s, modelId: e.target.value})} placeholder="openrouter/auto" />
      </label>

      <div className="grid grid-cols-2 gap-3 items-end">
        <label className="flex flex-col gap-1">
          <span className="text-sm text-kl-muted">Token-Cap pro Antwort</span>
          <input type="number" className="bg-[#0b0e12] border border-[#1f2937] rounded-lg px-3 py-2"
            value={s.tokenCapPerMsg} onChange={(e)=>setS({...s, tokenCapPerMsg: Number(e.target.value)})} />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm text-kl-muted">Tageslimit (Tokens)</span>
          <input type="number" className="bg-[#0b0e12] border border-[#1f2937] rounded-lg px-3 py-2"
            value={s.dailyTokenCap} onChange={(e)=>setS({...s, dailyTokenCap: Number(e.target.value)})} />
        </label>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={s.streaming} onChange={(e)=>setS({...s, streaming: e.target.checked})}/>
        Streaming aktivieren
      </label>

      <div className="flex gap-3">
        <button onClick={save} className="px-4 py-2 rounded-lg bg-kl-accent text-black">Speichern</button>
        <button onClick={doExport} className="px-4 py-2 rounded-lg bg-[#111827]">Export</button>
        <label className="px-4 py-2 rounded-lg bg-[#111827] cursor-pointer">
          Import
          <input type="file" className="hidden" accept="application/json" onChange={doImport}/>
        </label>
      </div>
    </div>
  );
}
