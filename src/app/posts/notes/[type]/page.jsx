import HeadingPage from "@/components/public/HeadingPage";
import { NotesPosts } from "@/components/public/NotesPosts";
import {
  getAllHubPosts,
  getAllPermanentPosts,
  getAllSlugs,
  getAllTopicsPosts
} from "@/lib/public-content";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  const { notesType } = getAllSlugs();
  return notesType;
}

export default async function DetailNotesPage({ params }) {
  const { type } = await params;

  let title;
  let description;
  let posts;

  if (type === "topics") {
    title = "Topics - Structured and Technical Notes";
    description =
      "In-depth, structured notes exploring complex or highly technical ideas. These entries focus on understanding and refining concepts rather than summarizing them.";
    posts = getAllTopicsPosts();
  } else if (type === "permanent") {
    title = "Permanent - Clear and Essential Notes";
    description =
      "Concise and well-formed notes that capture key insights, distilled knowledge, or ideas worth remembering. Each note stands as a clear, lasting takeaway.";
    posts = getAllPermanentPosts();
  } else if (type === "hub") {
    title = "Hub - Notes That Connect Ideas";
    description =
      "Notes that serve as connectors or entry points between related topics. A hub organizes relationships among notes, helping you navigate across themes and ideas.";
    posts = getAllHubPosts();
  } else {
    return notFound();
  }
  return (
    <div>
      <HeadingPage title={title} description={description} />
      <NotesPosts posts={posts} />
    </div>
  );
}
