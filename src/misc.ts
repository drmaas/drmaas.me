import { MarkdownInstance } from "astro";
import path from "path";

export interface Frontmatter {
  layout: string;
  title: string;
  date: string;
  image?: string;
  imageDescription?: string;
  tags: string[];
  description: string;
  draft?: boolean;
}

export function fileToSlug(file: string, extension: string) {
  return path.parse(file).base.replace(`.${extension}`, "/");
}

export function sortDateDescending(arg: MarkdownInstance<Frontmatter>[]) {
  return arg.sort(
    (a, b) =>
      new Date(b.frontmatter.date).getTime() -
      new Date(a.frontmatter.date).getTime(),
  );
}

export function getAllUniqueTags(arg: MarkdownInstance<Frontmatter>[]) {
  return Array.from(
    new Set(arg.map((e) => e.frontmatter.tags).flat()).values(),
  );
}

export function capitalizeString(arg: string) {
  return arg[0].toUpperCase() + arg.slice(1);
}
