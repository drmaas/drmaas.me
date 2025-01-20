import { CollectionEntry } from "astro:content";
import path from "path";

export function fileToSlug(file: string, extension: string) {
  return path.parse(file).base.replace(`.${extension}`, "/");
}

export function sortDateDescending(arg: CollectionEntry<"posts">[]) {
  return arg.sort(
    (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime(),
  );
}

export function getAllUniqueTags(arg: CollectionEntry<"posts">[]) {
  return Array.from(new Set(arg.map((e) => e.data.tags ?? []).flat()).values());
}

export function capitalizeString(arg: string) {
  return arg[0].toUpperCase() + arg.slice(1);
}
