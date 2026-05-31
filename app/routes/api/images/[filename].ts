import { Handlers } from "$fresh/server.ts";
import { join } from "$std/path/mod.ts";

const CONTENT_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
};

export const handler: Handlers = {
  async GET(_req, ctx) {
    const { filename } = ctx.params;
    if (filename.includes("..") || filename.includes("/")) {
      return new Response("Forbidden", { status: 403 });
    }
    const filePath = join(Deno.cwd(), "uploads", filename);
    try {
      const file = await Deno.readFile(filePath);
      const ext = filename.split(".").pop()?.toLowerCase() ?? "";
      const contentType = CONTENT_TYPES[ext] ?? "application/octet-stream";
      return new Response(file, {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=31536000",
        },
      });
    } catch {
      return new Response("Not Found", { status: 404 });
    }
  },
};
