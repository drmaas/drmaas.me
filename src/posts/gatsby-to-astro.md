---
title: Moving from Gatsby to Astro
date: 29 March 2024
description: example
tags:
  - featured
draft: false
---

## Background

I was not very satisfied with my [Gatsby](https://www.gatsbyjs.com/) site. I didn't understand a lot of the magic that was happening to render my markdown files as static HTML. I didn't know a lot about react, and it seemed like there was a lot of Gatsy-specific wiring and plumbing to understand. I wanted something simpler.

## Why Astro

I liked [Astro](https://astro.build/) because it was conceptually simpler. It focused on doing less out of the box while retaining the same amount of power to render markdown-based blog sites. I really wanted a framework that made it easy to:
  
* Write markdown annotated by frontmatter. Almost all static site generation frameworks have this
* Write custom components in regular HTML, JavaScript, and CSS. Astro makes this dead simple by using a jsx-like syntax. It also creates structure by making it easy to group the html, javascript and CSS needed to render a page, without magic getting in the way.
* Bring in other frameworks. Astro allowed me to easily use any other framework I wanted, like React, Vue, or Svelte.
* Make it easier to manage styles. Astro has a nice integration with [Tailwindcss](https://tailwindcss.com/) and made it easy to leverage [daisyUI](https://daisyui.com/) for nice componentry. I need this because I am not a CSS expert, and I don't usually have good design sense.
Avoid GraphQL by default. I did not like relying on GraphQL to provide the data needed to hydrate my pages. It felt like overkill and was overly complex.

## The Process

First, I found a template I liked and created a site from it. I used <https://github.com/MoofyWoofy/Bob-blog>. It had night mode, client-side content search, and global nav already set up.

Then I followed [the conversion guide](https://docs.astro.build/en/guides/migrate-to-astro/from-gatsby/) to start porting over resources. This made it easy to get basic things set up correctly, like static pages, images, favicon, and GitHub pages deployments.

Once I exhausted that, I found there were many other things I needed to fix:

* I wanted to have a rounded profile image with social links below it
* I wanted to make markdown headings linkable
* I wanted a floating table of contents on all content pages
* I wanted content pages to be able to show estimated reading time and previous/next links
* I wanted to change some of the layouts and colors on the site
* I wanted to change the markdown returned by the search

### Rounded Profile Image

After some trial and error, I realized that tailwind classes exist to make a picture nice and rounded. I also found some SVG code that rendered nice social icons. Done!

### Markdown headings

This involved adding the rehypeAutolinkHeadings plugin, and searching around to make the headings render like I wanted them to. See [astro.config.mjs](/astro.config.mjs) for details and links to source sites I found helpful.

### Floating Table of Contents

For some reason, I love this concept. Being able to infinitely scroll on a page while not losing track of the hierarchy on a page appeals to me greatly. This involves quite a bit of hacking. See [TableOfContents.astro](/src/components/TableOfContents.astro) for details and links to sites I found helpful.

### Allowing Articles Posts to Show Reading Time

This one small ask turned into a big redesign. By default, the blog used [Astro markdown layouts](https://docs.astro.build/en/basics/layouts/#markdownmdx-layouts). This worked well but made it impossible to access the raw content of the rendered page. I wanted that to calculate reading time. I also wanted to add navigation at the bottom of each post to the previous and next post.

To accomplish this, I used Astro's built-in [dynamic routing](https://docs.astro.build/en/guides/routing/#rest-parameters) to generate a slug page for each post, that contained references to the entire rendered markdown plus links to the previous and next post. See [[...slug].astro](/src/pages/articles/[...slug].astro) for the full layout.

For reading time, I built a reusable component that rendered a book icon and reading time from the raw page content.

### Changing Layouts and Colors

Honestly, I just hacked away at tailwind styles until things looked ok. I didn't come away with a full understanding of the right styles to use, and how to best apply them. I just made it look ok. You can judge the results for yourself!

### Changing the Search Results

I mostly copied content from the [article list](/src/pages/articles/[...page].astro). The main difference was that because the search is performed on the client, while the rest of the site is generated statically on the server,
I had to [insert the markdown](/src/pages/search/index.astro) as part of a javascript function that ran on the client. The results are very similar to the article list format. I also needed to adjust the Astro search [endpoint](https://docs.astro.build/en/guides/endpoints/)
to have the search request return the right data attributes.

## Wrapping it Up

That's a very brief overview of my process. I spent more hours on this than I'd like to admit; it was anything but easy, and I spent a lot of time learning about the fundamentals of Astro. I also spent a lot of time stitching together existing
examples of how to wire data together, rather than reinventing it all on my own. I feel like I was successful in that regard - there are many smart and experienced front-end professionals out that inspired and guided my efforts. I made my best effort to cite the pages that helped me.