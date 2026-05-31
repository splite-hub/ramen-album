import type { RamenEntry } from "./types.ts";

const kv = await Deno.openKv();

export async function getAllRamen(): Promise<RamenEntry[]> {
  const entries: RamenEntry[] = [];
  const iter = kv.list<RamenEntry>({ prefix: ["ramen"] });
  for await (const entry of iter) {
    entries.push(entry.value);
  }
  return entries.sort((a, b) => b.createdAt - a.createdAt);
}

export async function getRamen(id: string): Promise<RamenEntry | null> {
  const result = await kv.get<RamenEntry>(["ramen", id]);
  return result.value;
}

export async function saveRamen(entry: RamenEntry): Promise<void> {
  await kv.set(["ramen", entry.id], entry);
}

export async function deleteRamen(id: string): Promise<void> {
  await kv.delete(["ramen", id]);
}
