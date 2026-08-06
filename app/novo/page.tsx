import { listPresets } from "@/lib/store";
import { createPost } from "@/app/actions";
import NovoForm from "./NovoForm";

export const dynamic = "force-dynamic";

export default async function NovoPostPage() {
  const presets = await listPresets();
  return (
    <div>
      <h1 className="text-2xl font-extrabold mb-6">Novo post</h1>
      <NovoForm presets={presets} createPost={createPost} />
    </div>
  );
}
