import { Handlers, PageProps } from "$fresh/server.ts";
import { getAllRamen } from "../lib/kv.ts";
import type { RamenEntry } from "../lib/types.ts";

export const handler: Handlers<RamenEntry[]> = {
  async GET(_req, ctx) {
    const entries = await getAllRamen();
    return ctx.render(entries);
  },
};

function Stars({ rating }: { rating?: number }) {
  if (!rating) return null;
  return (
    <div class="flex">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} class={i <= rating ? "text-yellow-400 text-xs" : "text-gray-300 text-xs"}>
          ★
        </span>
      ))}
    </div>
  );
}

export default function Home({ data }: PageProps<RamenEntry[]>) {
  return (
    <div class="min-h-screen bg-amber-50">
      <header class="bg-orange-600 text-white shadow-md">
        <div class="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 class="text-2xl font-bold">🍜 ラーメンアルバム</h1>
          <a
            href="/ramen/new"
            class="bg-white text-orange-600 font-semibold px-4 py-2 rounded-full text-sm hover:bg-orange-50 transition"
          >
            ＋ 追加
          </a>
        </div>
      </header>

      <main class="max-w-5xl mx-auto px-4 py-8">
        {data.length === 0
          ? (
            <div class="text-center py-24">
              <div class="text-8xl mb-4">🍜</div>
              <p class="text-gray-500 text-lg mb-6">まだ登録されていません</p>
              <a
                href="/ramen/new"
                class="bg-orange-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-600 transition"
              >
                最初のラーメンを登録
              </a>
            </div>
          )
          : (
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {data.map((entry) => (
                <a
                  key={entry.id}
                  href={`/ramen/${entry.id}`}
                  class="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden group"
                >
                  {entry.imageFile
                    ? (
                      <img
                        src={`/api/images/${entry.imageFile}`}
                        alt={entry.ramenName}
                        class="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )
                    : (
                      <div class="w-full h-40 bg-amber-100 flex items-center justify-center text-5xl">
                        🍜
                      </div>
                    )}
                  <div class="p-3">
                    <p class="font-semibold text-gray-800 text-sm truncate">{entry.ramenName}</p>
                    <p class="text-gray-500 text-xs truncate mt-0.5">{entry.shopName}</p>
                    <div class="flex items-center justify-between mt-2">
                      <Stars rating={entry.rating} />
                      <span class="text-gray-400 text-xs">{entry.date}</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
      </main>
    </div>
  );
}
