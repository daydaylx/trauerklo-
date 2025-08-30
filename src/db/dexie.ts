import Dexie, { Table } from "dexie";
import type { Message, Summary, KlossConfig, Settings } from "../types/core";

export class TKDB extends Dexie {
  messages!: Table<Message, string>;
  summaries!: Table<Summary, number>;
  presets!: Table<KlossConfig, string>;
  settings!: Table<Settings, string>;

  constructor() {
    super("trauerkloß-db");
    this.version(1).stores({
      messages: "id, ts, role",
      summaries: "ts",
      presets: "id, label",
      settings: "apiKey"
    });
  }
}

export const db = new TKDB();

// Helpers
export async function getSettings(): Promise<Settings | null> {
  return (await db.settings.toArray())[0] ?? null;
}
export async function saveSettings(s: Settings) {
  await db.settings.clear();
  await db.settings.add(s);
}
