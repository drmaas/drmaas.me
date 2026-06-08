---
name: blog-post-review
description: Review and edit blog posts for grammar, technical correctness, structure, and flow while preserving the author's unique voice and personality. Use this skill whenever the user says "review this post", "check this draft", "proofread this", "edit this post", "look over my draft", or asks for any kind of editorial feedback on a blog post or article. Do not skip this skill even for simple-looking requests — what seems like a quick proofread often needs structural and factual review too.
---

# blog-post-review

Review and edit blog posts from this repo. The core goal: make the post better while keeping it sounding like the author wrote it. You are an editor, not a replacement author.

## Workflow

### 1. Read the post

Find the blog post file. It could be in `src/posts/` (published) or `drafts/` (draft). If the user gives you the content inline, work from that. If they name a file or a slug, find it and read it. Also read the frontmatter — title, description, tags — since those may need editing too.

### 2. Review across four dimensions

Read the post carefully. Take notes on each of these areas:

**A. Grammar & mechanics**
- Spelling errors, typos, punctuation issues
- Subject-verb agreement, tense consistency
- Comma splices, run-ons, fragments
- Misused words (e.g., "its" vs "it's", "your" vs "you're")
- Markdown formatting issues (broken links, missing alt text, malformed code blocks)

**B. Factual accuracy**
- Technical claims: are code snippets syntactically correct? Do configuration examples match reality?
- Links: do they point to real, relevant resources? Are they formatted correctly?
- Numbers, dates, versions: are they internally consistent and plausible?
- Conceptual accuracy: does the explanation make sense given how the technology actually works?
- If you're unsure about a factual claim, flag it as "needs author review" rather than guessing.

**C. Structure & flow**
- Does the opening hook the reader? Does it make clear what they'll learn?
- Are transitions between sections smooth, or do they jump?
- Do headings accurately describe their section content?
- Is the pacing right — too long on setup, too brief on the payoff?
- Does the conclusion tie back to the opening? Does it leave the reader satisfied?
- Are there any redundant or meandering passages that could be tightened?

**D. Tone & personality**
- Does this sound like the author? Read a couple of their other posts from `src/posts/` to calibrate.
- The author's voice: direct, conversational, technically precise but not stiff. Uses "I" freely. Occasionally drops in dry humor or understatement. Sentences can be long and detailed, but never aimless. Avoids corporate jargon.
- Would a human enjoy reading this, or does it sound like AI-generated content?
- Are there phrases that feel generic ("In today's digital landscape", "leveraging solutions") that should be rewritten in the author's voice?
- Flag edits that affect voice separately from other edits — the author should decide on tone changes explicitly.

### 3. Present findings as a categorized list

Show the user your findings organized by category. For each finding:

- **Quote the original text** so the user can see exactly what you're referring to
- **Explain the issue** briefly (why it's wrong, why it's awkward)
- **Offer your suggested fix** as a clear edit
- **Flag the category**: [grammar] [factual] [structure] [tone]

Structure presentation like this:

```
## Review: [post title]

### Grammar & Mechanics
- **[grammar]** "Its really important to..." → "It's really important to..." (missing apostrophe)
- **[grammar]** "The data show that..." → "The data shows that..." (consistency with rest of post)

### Factual Accuracy
- **[factual]** You mention "Python 3.12" but the asyncio API you show was added in 3.11. Possible you meant 3.11? (needs author review)
- **[factual]** Link to AWS docs at line 42: the URL has a typo ("amazoon" instead of "amazon")

### Structure & Flow
- **[structure]** Section 3 ("The Setup") is 4 paragraphs of setup before we get to the actual problem. Consider trimming to 2 paragraphs or moving some context after the reveal.
- **[structure]** The conclusion feels abrupt — you introduce a new idea in the last paragraph without resolving it. Consider moving that idea to its own section or cutting it.

### Tone & Personality
- **[tone]** "In the modern era of cloud computing, one must carefully consider..." → "Cloud computing is great until you forget to set a timeout. Here's what happened to me." (too corporate, doesn't sound like you)
```

For each suggestion, ask the user which they want to apply. Offer clear choices:

> "Here are my suggestions. Which would you like me to apply? You can say 'all grammar', 'just 1, 3, and 5', 'everything except tone changes', or pick individually."

### 4. Apply edits

Once the user tells you what they want applied:
1. Make each edit carefully
2. Read the post again after all edits to make sure the flow still works
3. Check that the frontmatter is still valid
4. Report back what you changed

## Important principles

- **Sound like the author.** This is the most important rule. Read their other posts before editing. You're helping them communicate more clearly, not rewriting them in your own voice. If an edit would change the character of their writing, flag it for their decision.
- **Written for humans.** Prefer clear, vivid language over formal or generic phrasing. If it sounds like it could come from a corporate blog, rewrite it.
- **Factual accuracy matters more than grammar.** A grammatically perfect post with wrong code is useless. Prioritize factual correctness.
- **When in doubt, ask.** If you're not confident about a factual claim, a reference, or whether something matches the author's voice, flag it rather than guessing. The author would rather make the call themselves.
- **Respect the author's decisions.** If they overrule your suggestion, accept it gracefully and move on.

## File conventions

- Published posts: `src/posts/<slug>.md`
- Drafts: `drafts/<slug>/index.md`
- Frontmatter uses YAML with fields: `title`, `date`, `description`, `tags`, `draft`