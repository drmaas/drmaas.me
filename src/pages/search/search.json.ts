import { MarkdownInstance } from "astro";
import { Frontmatter } from "src/misc";
import { parse } from "node-html-parser";

export async function GET() {
  const allPosts = import.meta.glob<MarkdownInstance<Frontmatter>>(
    "../articles/content/*.md",
    { eager: true },
  ); // Vite
  const posts = Object.values(allPosts)
    .filter((ele) => ele.frontmatter.draft != true)
    .map((ele) => {
      return {
        title: ele.frontmatter.title,
        url: ele.url,
        date: ele.frontmatter.date,
        description:
          ele.frontmatter.description ||
          parse(ele.compiledContent()).querySelector("p:first-of-type")
            ?.innerText,
        tags: ele.frontmatter.tags,
      };
    });
  return new Response(JSON.stringify(posts));
}
