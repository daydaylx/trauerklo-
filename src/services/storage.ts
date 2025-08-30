import { db } from "../db/dexie";
import type { KlossConfig, Settings, Message, Summary } from "../types/core";

export async function exportAll(): Promise<Blob> {
  const [settings, presets, messages, summaries] = await Promise.all([
    db.settings.toArray(), db.presets.toArray(), db.messages.toArray(), db.summaries.toArray()
  ]);
  const data = { settings, presets, messages, summaries, v: 1 };
  return new Blob([JSON.stringify(data)], { type: "application/json" });
}

export async function importAll(file: File) {
  const text = await file.text();
  const data = JSON.parse(text);
  if (!data || data.v !== 1) throw new Error("Ungültiges Exportformat");
  await db.transaction("rw",
    db.settings, db.presets, db.messages, db.summaries,
    async () => {
      await Promise.all([db.settings.clear(), db.presets.clear(), db.messages.clear(), db.summaries.clear()]);
      if (data.settings?.length) await db.settings.bulkAdd(data.settings as Settings[]);
      if (data.presets?.length) await db.presets.bulkAdd(data.presets as KlossConfig[]);
      if (data.messages?.length) await db.messages.bulkAdd(data.messages as Message[]);
      if (data.summaries?.length) await db.summaries.bulkAdd(data.summaries as Summary[]);
    }
  );
}
