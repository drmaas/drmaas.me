import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const blogCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/posts" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string().transform((str) => new Date(str)),
    tags: z.array(z.string()),
    image: z.string().optional(),
    imageDescription: z.string().optional(),
    draft: z.boolean().optional(),
  }),
});

export const collections = {
  posts: blogCollection,
};
