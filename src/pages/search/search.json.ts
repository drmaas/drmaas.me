import { fileToSlug } from "src/misc";
import { getPublishedPosts } from "src/lib/published-posts";
import { parse } from "node-html-parser";

export async function GET() {
  const published = await getPublishedPosts();
  const posts = published.map((ele) => {
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
