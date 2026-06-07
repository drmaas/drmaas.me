import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import { z } from "astro/zod";

const blogCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/posts" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string().transform((str) => new Date(str)),
    image: z.string().optional(),
    imageDescription: z.string().optional(),
    draft: z.boolean().optional(),
  }),
});

export const collections = {
  posts: blogCollection,
};
