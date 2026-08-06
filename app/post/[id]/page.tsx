import { notFound } from "next/navigation";
import { getPost, getPreset } from "@/lib/store";
import PostView from "./PostView";

export const dynamic = "force-dynamic";

export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await getPost(params.id);
  if (!post) notFound();
  const preset = post.presetId ? await getPreset(post.presetId) : null;

  return (
    <div>
      <h1 className="text-2xl font-extrabold mb-6">{post.title}</h1>
      <PostView post={post} preset={preset} />
    </div>
  );
}
