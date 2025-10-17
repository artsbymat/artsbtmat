/**
 * HeadingPage.jsx
 *
 * A presentational React component for displaying a page heading section
 * with optional description, semantic title element, and responsive layout.
 *
 * ---
 * ## Purpose
 * Designed as a simple and consistent wrapper for page titles — e.g. section headers
 * like "Blog", "Notes", or other top-level pages. It provides a flexible API while keeping
 * style minimal and predictable.
 *
 * ---
 * ## Props
 *
 * @param {string|React.ReactNode} title - Main heading text or JSX node. Rendered inside the semantic element defined by `as`.
 * @param {string|React.ReactNode} [description] - Optional supporting text below the title.
 * @param {"default"} [variant="default"] - Controls spacing and typography size preset. (Currently only `default` variant is defined.)
 * @param {string} [className=""] - Additional Tailwind classes applied to the outermost wrapper.
 * @param {string} [titleClassName=""] - Additional classes for the title element.
 * @param {string} [descClassName=""] - Additional classes for the description paragraph.
 * @param {string|React.ElementType} [as="h1"] - Custom semantic element for the title (e.g. `h2`, `h3`).
 *
 * ---
 * ## Structure
 * - **Wrapper:** Full-width container with a bottom border (`border-b-1 border-b-border`).
 * - **Inner container:** Constrained to `max-w-7xl` with responsive padding and the custom `graph-paper` background.
 * - **Flex layout:** Uses `flex` to space heading and potential future actions evenly.
 * - **Title:** Controlled by `as` prop; defaults to `<h1>`.
 * - **Description:** Optional paragraph rendered below the title.
 *
 * ---
 * ## Styling
 * The component uses a single variant map (`variantMap`) that defines spacing and typography:
 * ```js
 * default: {
 *   wrapper: "py-6 md:py-8",
 *   title: "text-3xl md:text-4xl font-medium",
 *   desc: "mt-3 text-sm md:text-base text-muted max-w-prose"
 * }
 * ```
 * - `graph-paper` provides a custom background grid.
 * - `border-b-border` and `border-b-1` define the dividing line.
 * - Typography scales responsively (`text-3xl → text-4xl`, etc.).
 *
 * ---
 * ## Accessibility
 * - Uses semantic heading levels for screen reader hierarchy (`h1`, `h2`, ...).
 * - Adds `aria-label` automatically when `title` is a plain string.
 *
 * ---
 * ## Example Usage
 * ```jsx
 * <HeadingPage
 *   title="Garden of Thoughts - Blog, Notes & Mindmaps"
 *   description="A space where ideas grow and connect. Browse through essays, quick notes, and visual mindmaps tracing the evolution of thinking and creativity."
 * />
 * ```
 *
 * ### Alternate heading level
 * ```jsx
 * <HeadingPage as="h2" title="Notes" description="Short-form thoughts and ideas." />
 * ```
 *
 * ---
 * ## Design philosophy
 * - Keeps implementation minimal and explicit.
 * - Encourages semantic HTML structure.
 * - Relies on Tailwind utilities for styling flexibility.
 */

export default function HeadingPage({
  title,
  description,
  variant = "default",
  containerClassName = "",
  titleClassName = "",
  descClassName = "",
  as: Component = "h1",
  children
}) {
  const variantMap = {
    default: {
      wrapper: "py-6 md:py-8",
      title: "text-3xl md:text-4xl font-medium",
      desc: "mt-3 text-sm md:text-base text-muted max-w-prose"
    }
  };

  const v = variantMap[variant] || variantMap.default;

  return (
    <div className={`border-b-border w-full border-b-1 ${containerClassName}`}>
      <div className={`graph-paper mx-auto max-w-7xl px-4 md:px-8 ${v.wrapper}`}>
        <div className={`flex items-start justify-between gap-6`}>
          <div className="min-w-0 flex-1">
            {/* Title - semantic element controlled by `as` prop */}
            <Component
              className={`${v.title} ${titleClassName} break-words`}
              aria-label={typeof title === "string" ? title : undefined}
            >
              {title}
            </Component>

            {description && <p className={`${v.desc} ${descClassName} mt-3`}>{description}</p>}
            {children || null}
          </div>
        </div>
      </div>
    </div>
  );
}
