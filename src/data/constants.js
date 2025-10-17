export const UI = {
  NAVIGATION_LINKS: [
    {
      title: "Work",
      href: "/work"
    },
    {
      title: "Second Brain",
      href: "/posts"
    }
  ],
  FOOTER_LINKS: [
    {
      title: "Rss",
      href: "/rss.xml"
    },
    {
      title: "Sitemap",
      href: "/sitemap.xml"
    },
    {
      title: "Tags",
      href: "/tags"
    }
  ]
};

export const IGNORE_PATHS = [
  "01. Daily Notes",
  "02. Reference Notes/Kanban",
  "02. Reference Notes/Excalidraw/Assets",
  "02. Reference Notes/Excalidraw/Hooks",
  "02. Reference Notes/Excalidraw/Scripts",
  "05. Outputs/Video",
  "Templates",
  "Attachments"
];

/**
 * Defines custom path-to-slug mapping rules.
 *
 * Keys represent relative paths from the `src/content` directory.
 * Values define the desired slug prefix.
 *
 * Example:
 *   "01. Daily Notes" → "/posts/daily"
 *   "02. Reference Notes/Topics" → "/posts/topics"
 */
export const SLUG_RULES = {
  "02. Reference Notes/Topics": "/posts/notes/topics",
  "02. Reference Notes/Excalidraw": "/posts/notes/excalidraw",
  "03. Permanent Notes": "/posts/notes/permanent",
  "04. Hub Notes": "/posts/notes/hub",
  "05. Outputs/Blog": "/posts/blog",
  "05. Outputs/Static": "/posts/static"
};
