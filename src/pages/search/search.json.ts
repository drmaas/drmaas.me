import { fileToSlug } from "src/misc";
import { parse } from "node-html-parser";
import { getCollection } from "astro:content";

export async function GET() {
  const allPosts = await getCollection("posts");
  const posts = Object.values(allPosts)
    .filter((ele) => ele.data.draft != true)
    .map((ele) => {
      const rendered = ele.rendered?.html ?? "";
      return {
        title: ele.data.title,
        url: `/articles/${fileToSlug(ele.filePath ?? "", "md")}`,
        date: new Date(ele.data.date).toDateString(),
        description:
          ele.data.description ||
          parse(rendered).querySelector("p:first-of-type")?.innerText,
      };
    });
  return new Response(JSON.stringify(posts));
}
