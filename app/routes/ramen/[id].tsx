import { Handlers, PageProps } from "$fresh/server.ts";
import { join } from "$std/path/mod.ts";
import { deleteRamen, getRamen } from "../../lib/kv.ts";
import type { RamenEntry } from "../../lib/types.ts";

export const handler: Handlers<RamenEntry> = {
  async GET(_req, ctx) {
    const entry = await getRamen(ctx.params.id);
    if (!entry) return ctx.renderNotFound();
    return ctx.render(entry);
  },
  async POST(req, ctx) {
    const form = await req.formData();
    if (form.get("_action") === "delete") {
      const entry = await getRamen(ctx.params.id);
      if (entry?.imageFile) {
        try {
          await Deno.remove(join(Deno.cwd(), "uploads", entry.imageFile));
        } catch { /* ignore */ }
      }
      await deleteRamen(ctx.params.id);
      return new Response("", { status: 302, headers: { Location: "/" } });
    }
    return new Response("Bad Request", { status: 400 });
  },
};

function Stars({ rating }: { rating?: number }) {
  if (!rating) return null;
  return (
    <div class="flex">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} class={`text-2xl ${i <= rating ? "text-yellow-400" : "text-gray-200"}`}>
          ★
        </span>
      ))}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value?: string | number }) {
  if (!value && value !== 0) return null;
  return (
    <div class="flex gap-3">
      <span class="text-gray-500 text-sm w-28 shrink-0">{label}</span>
      <span class="text-gray-800 text-sm">{String(value)}</span>
    </div>
  );
}

export default function RamenDetail({ data }: PageProps<RamenEntry>) {
  return (
    <div class="min-h-screen bg-amber-50">
      <header class="bg-orange-600 text-white shadow-md">
        <div class="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <a href="/" class="text-white hover:text-orange-200 text-lg">←</a>
          <h1 class="text-xl font-bold truncate">{data.ramenName}</h1>
        </div>
      </header>

      <main class="max-w-2xl mx-auto px-4 py-8">
        <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
          {data.imageFile
            ? (
              <img
                src={`/api/images/${data.imageFile}`}
                alt={data.ramenName}
                class="w-full max-h-96 object-cover"
              />
            )
            : (
              <div class="w-full h-64 bg-amber-100 flex items-center justify-center text-8xl">
                🍜
              </div>
            )}

          <div class="p-6 space-y-4">
            <div>
              <h2 class="text-2xl font-bold text-gray-900">{data.ramenName}</h2>
              <p class="text-gray-500 mt-1">{data.shopName}</p>
            </div>

            {data.rating ? <Stars rating={data.rating} /> : null}

            <div class="space-y-3 pt-3 border-t border-gray-100">
              <InfoRow label="食べた日" value={data.date} />
              <InfoRow label="場所" value={data.location} />
              <InfoRow label="種類" value={data.ramenType} />
              <InfoRow label="麺の太さ" value={data.noodleThickness} />
              <InfoRow label="具材" value={data.toppings} />
              <InfoRow label="美味しかった点" value={data.highlights} />
              <InfoRow label="メモ" value={data.memo} />
            </div>

            <div class="pt-4 border-t border-gray-100 flex justify-end">
              <form method="POST">
                <input type="hidden" name="_action" value="delete" />
                <button
                  type="submit"
                  class="text-red-400 hover:text-red-600 text-sm font-medium transition"
                >
                  削除する
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
