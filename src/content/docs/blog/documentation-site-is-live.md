---
title: The documentation site is live
date: 2026-05-29
authors: tobias
tags: [meta, documentation]
excerpt: First post in the build log. The old WordPress site is being replaced with a static site in Git, so the documentation can be written directly in Markdown.
---

This is the first post in the project's **build log**. The idea behind the log is to capture the *chronology* of the build — what happened, what was tested, and what went wrong — while the polished reference documentation lives under its respective subsystems (inverter, motor, battery, chassis).

## Why a new site?

The project has been documented on a WordPress site so far. It's now being replaced with a **static site versioned in Git**. The benefits:

- Documentation is written in **Markdown**, directly in the codebase — no admin interface.
- Everything is versioned: history, diffs and the ability to roll back.
- **Automatic publishing** on push (GitOps).

## How do you write a new post?

Create a Markdown file in `src/content/docs/blog/` with frontmatter:

```yaml
---
title: Post title
date: 2026-05-29
authors: tobias
tags: [inverter, bring-up]
excerpt: A short summary shown in the list and on tag pages.
---
```

The rest of the file is plain Markdown. The post shows up automatically in the list at `/blog`, in the RSS feed and under its tags — no registration needed.

Next up: flesh out the inverter documentation and wire up automatic deployment.
