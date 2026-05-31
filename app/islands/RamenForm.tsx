import { useSignal } from "@preact/signals";

const RAMEN_TYPES = ["醤油", "味噌", "塩", "豚骨", "担々麺", "つけ麺", "その他"];
const NOODLE_TYPES = ["細麺", "普通", "太麺", "極太"];

interface Props {
  error?: string;
  today: string;
}

export default function RamenForm({ error, today }: Props) {
  const previewUrl = useSignal<string | null>(null);
  const rating = useSignal(0);

  return (
    <form method="POST" encType="multipart/form-data" class="bg-white rounded-2xl shadow-sm p-6 space-y-5">
      {error && (
        <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">写真</label>
        {previewUrl.value
          ? (
            <img
              src={previewUrl.value}
              alt="プレビュー"
              class="w-full max-h-72 object-cover rounded-xl"
            />
          )
          : (
            <div class="w-full h-48 bg-amber-100 rounded-xl flex items-center justify-center text-6xl select-none">
              🍜
            </div>
          )}
        <input
          type="file"
          name="image"
          accept="image/*"
          class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
          onChange={(e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) previewUrl.value = URL.createObjectURL(file);
          }}
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          店名 <span class="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="shopName"
          required
          class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          placeholder="例：一蘭"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          ラーメン名 <span class="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="ramenName"
          required
          class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          placeholder="例：天然とんこつラーメン"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          食べた日 <span class="text-red-500">*</span>
        </label>
        <input
          type="date"
          name="date"
          defaultValue={today}
          required
          class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">評価</label>
        <div class="flex gap-1">
          {[1, 2, 3, 4, 5].map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => {
                rating.value = rating.value === v ? 0 : v;
              }}
              class={`text-3xl transition-colors ${
                v <= rating.value ? "text-yellow-400" : "text-gray-300"
              } hover:text-yellow-400`}
            >
              ★
            </button>
          ))}
        </div>
        <input type="hidden" name="rating" value={rating.value > 0 ? String(rating.value) : ""} />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">種類</label>
          <select
            name="ramenType"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option value="">-- 選択 --</option>
            {RAMEN_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">麺の太さ</label>
          <select
            name="noodleThickness"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option value="">-- 選択 --</option>
            {NOODLE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">場所・住所</label>
        <input
          type="text"
          name="location"
          class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          placeholder="例：東京都渋谷区..."
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">具材</label>
        <input
          type="text"
          name="toppings"
          class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          placeholder="例：チャーシュー、煮卵、海苔"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">美味しかったポイント</label>
        <textarea
          name="highlights"
          rows={2}
          class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          placeholder="例：スープの濃厚さ、チャーシューの柔らかさ"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">メモ</label>
        <textarea
          name="memo"
          rows={3}
          class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          placeholder="感想・次回への覚書など"
        />
      </div>

      <div class="flex gap-3 pt-2">
        <button
          type="submit"
          class="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition"
        >
          登録する
        </button>
        <a
          href="/"
          class="flex-1 text-center border border-gray-300 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-50 transition"
        >
          キャンセル
        </a>
      </div>
    </form>
  );
}
