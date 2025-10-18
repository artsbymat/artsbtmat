import Link from "next/link";

export function TagsList({ tagsWithCount }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-2 md:px-8">
      <ul className="divide-border-border divide-y">
        {tagsWithCount.map((item) => (
          <li key={item.tag}>
            <div className="my-2">
              <Link href={`/tags/${item.tag}`} className="font-normal">
                {item.tag}
              </Link>
              <p className="text-sm font-light">{item.count} posts</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
