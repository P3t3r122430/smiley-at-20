import { createFileRoute } from "@tanstack/react-router";

/**
 * The experience itself is a self-contained static page
 * (public/index.html + public/style.css + public/script.js).
 * This route presents it full-screen at "/".
 */
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "For Smiley — National Girlfriend Day" },
      {
        name: "description",
        content:
          "A cinematic one-page letter for Yvonne, known to me as Smiley. Made by Peter for National Girlfriend Day.",
      },
      { property: "og:title", content: "For Smiley — National Girlfriend Day" },
      {
        property: "og:description",
        content:
          "Out of billions of people, millions of smiles, thousands of conversations — I ended up here.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <iframe
      src="/index.html"
      title="For Smiley — National Girlfriend Day"
      className="fixed inset-0 h-screen w-screen border-0 bg-background"
    />
  );
}
