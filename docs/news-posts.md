# Publishing nekoHub news

The News page is driven by `app/content/news.js`. Add each new post to the top
of the `newsPosts` array, then build and deploy the site. No external CMS account
is needed.

Each post has a unique `slug`, an ISO date (`YYYY-MM-DD`), category, version,
title, summary, GitHub release URL, and a `body` array. Body blocks support:

- `{ type: "paragraph", text: "..." }`
- `{ type: "heading", text: "..." }`
- `{ type: "code", text: "..." }`
- `{ type: "link", text: "...", href: "/path" }`

The first post in the array is featured on `/news`; all posts also have their
own page at `/news/<slug>`.
