import {
  getAllBlogPosts,
  getAllHubPosts,
  getAllPermanentPosts,
  getAllTopicsPosts,
  getAllUniqueTags
} from "@/lib/public-content";

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "");

  if (!baseUrl) {
    console.error("NEXT_PUBLIC_BASE_URL is not defined");
    return [];
  }

  const staticRoutes = [
    { slug: "/" },
    { slug: "/work" },
    { slug: "/posts" },
    { slug: "/posts/blog" },
    { slug: "/posts/notes/topics" },
    { slug: "/posts/notes/permanent" },
    { slug: "/posts/notes/hub" },
    { slug: "/tags" }
  ].map((route) => ({
    url: `${baseUrl}${route.slug}`
  }));

  const blogPosts = getAllBlogPosts().map((post) => ({
    url: `${baseUrl}${post.slug}`
  }));

  const notes = [...getAllTopicsPosts(), ...getAllPermanentPosts(), ...getAllHubPosts()].map(
    (note) => ({
      url: `${baseUrl}${note.slug}`
    })
  );

  const tags = getAllUniqueTags().map((tag) => ({
    url: `${baseUrl}/tags/${tag}`
  }));

  const allUrls = [...staticRoutes, ...blogPosts, ...notes, ...tags];

  return allUrls;
}
