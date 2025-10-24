import { getAllStaticJSON } from "@/lib/public-static";

export function SkillsSection() {
  const skills = getAllStaticJSON().find(({ slug }) => slug === "Skills");

  if (!skills || !Array.isArray(skills.data)) {
    return (
      <section className="mx-auto my-4 max-w-7xl px-4 md:px-8">
        <p className="text-center text-sm text-yellow-700">No skills data found.</p>
      </section>
    );
  }

  const categorizedTools = skills.data.map(({ title, tools }) => ({
    category: title,
    tools
  }));

  return (
    <section className="mx-auto my-4 max-w-7xl px-4 md:px-8">
      <div>
        <h2 className="text-xl leading-snug font-medium">Skills</h2>
        <p className="text-sm font-light">
          A snapshot of the tools and technologies I use to build, design, and refine digital
          experiences - from frontend frameworks to backend services and development platforms.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="border-border my-4 w-full border-collapse border">
          <thead>
            <tr>
              {categorizedTools.map(({ category }) => (
                <th key={category} className="border-border border px-4 py-2 text-left font-normal">
                  {category}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="align-top text-sm font-light">
            <tr>
              {categorizedTools.map(({ category, tools }) => (
                <td key={category} className="border-border border px-4 py-2">
                  <p className="list-inside list-disc">{tools.join(", ")}</p>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
