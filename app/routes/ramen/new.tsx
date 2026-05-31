import { Handlers, PageProps } from "$fresh/server.ts";
import { join } from "$std/path/mod.ts";
import { saveRamen } from "../../lib/kv.ts";
import type { RamenEntry } from "../../lib/types.ts";
import RamenForm from "../../islands/RamenForm.tsx";

interface Data {
  error?: string;
  today: string;
}

export const handler: Handlers<Data> = {
  GET(_req, ctx) {
    const today = new Date().toISOString().slice(0, 10);
    return ctx.render({ today });
  },
  async POST(req, ctx) {
    const today = new Date().toISOString().slice(0, 10);
    try {
      const form = await req.formData();
      const shopName = (form.get("shopName") as string | null)?.trim();
      const ramenName = (form.get("ramenName") as string | null)?.trim();
      const date = form.get("date") as string | null;

      if (!shopName || !ramenName || !date) {
        return ctx.render({ today, error: "店名・ラーメン名・日付は必須です" });
      }

      let imageFile = "";
      const imageData = form.get("image") as File | null;
      if (imageData && imageData.size > 0) {
        const ext = (imageData.name.split(".").pop() ?? "jpg").toLowerCase();
        const allowed = ["jpg", "jpeg", "png", "webp", "gif"];
        if (!allowed.includes(ext)) {
          return ctx.render({ today, error: "画像はJPG/PNG/WebP/GIF形式のみ対応しています" });
        }
        imageFile = `${crypto.randomUUID()}.${ext}`;
        const uploadDir = join(Deno.cwd(), "uploads");
        await Deno.mkdir(uploadDir, { recursive: true });
        const buf = await imageData.arrayBuffer();
        await Deno.writeFile(join(uploadDir, imageFile), new Uint8Array(buf));
      }

      const ratingStr = form.get("rating") as string | null;
      const entry: RamenEntry = {
        id: crypto.randomUUID(),
        shopName,
        ramenName,
        imageFile,
        date,
        location: (form.get("location") as string)?.trim() || undefined,
        rating: ratingStr ? Number(ratingStr) : undefined,
        memo: (form.get("memo") as string)?.trim() || undefined,
        ramenType: (form.get("ramenType") as string) || undefined,
        noodleThickness: (form.get("noodleThickness") as string) || undefined,
        toppings: (form.get("toppings") as string)?.trim() || undefined,
        highlights: (form.get("highlights") as string)?.trim() || undefined,
        createdAt: Date.now(),
      };

      await saveRamen(entry);
      return new Response("", { status: 302, headers: { Location: "/" } });
    } catch (e) {
      console.error(e);
      return ctx.render({ today, error: "保存に失敗しました" });
    }
  },
};

export default function NewRamen({ data }: PageProps<Data>) {
  return (
    <div class="min-h-screen bg-amber-50">
      <header class="bg-orange-600 text-white shadow-md">
        <div class="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <a href="/" class="text-white hover:text-orange-200 text-lg">←</a>
          <h1 class="text-xl font-bold">ラーメンを登録</h1>
        </div>
      </header>
      <main class="max-w-2xl mx-auto px-4 py-8">
        <RamenForm error={data.error} today={data.today} />
      </main>
    </div>
  );
}
