import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getLatestPost() {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // No rows returned, which means no posts yet
      return null;
    }
    // For other errors, we'll throw
    throw error;
  }
  return data;
}

export async function createPost(caption: string, imageUrl: string) {
  const { data, error } = await supabase
    .from("posts")
    .insert([{ caption, image_url: imageUrl }])
    .select();

  if (error) throw error;
  return data[0];
}

export async function getAllPosts() {
  const { data: posts, error } = await supabase
    .from("posts")
    .select("id, image_url, caption, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching posts:", error);
    return [];
  }

  return posts;
}
