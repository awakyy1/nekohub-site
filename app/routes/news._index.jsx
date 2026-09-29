import { Link } from "@remix-run/react";
import { useEffect, useState } from "react";
import BrandLogo from "../components/BrandLogo";
import DotField from "../components/DotField";
import NewsHeader from "../components/NewsHeader";
import { newsPosts } from "../content/news";

const GITHUB_ISSUES = "https://api.github.com/repos/awakyy1/nekohub-site/issues?state=closed&per_page=100";

function issueField(body, label) {
  const match = body.match(new RegExp(`### ${label}\\s*\\n+([\\s\\S]*?)(?=\\n### |$)`, "i"));
  const value = match ? match[1].trim() : "";
  return /^\*?no response\*?$/i.test(value) ? "" : value;
}

function safeLink(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : "";
  } catch {
    return "";
  }
}

function issuePost(issue) {
  const body = issue.body || "";
  const date = issue.closed_at?.slice(0, 10) || issue.created_at.slice(0, 10);
  return {
    slug: `github-${issue.number}`,
    date,
    version: issueField(body, "Version") || "nekoHub",
    title: issueField(body, "Title") || issue.title.replace(/^News:\s*/i, ""),
    summary: issueField(body, "Summary"),
    releaseUrl: safeLink(issueField(body, "Release link")),
    body: issueField(body, "Content").split(/\n\s*\n/).filter(Boolean).map((text) => ({ type: "paragraph", text }))
  };
}

export const meta = () => [
  { title: "News and updates | nekoHub" },
  { name: "description", content: "Release notes and updates from nekoHub, the Linux fleet management TUI." }
];

function formatDate(date) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));
}

function PostMeta({ post }) {
  return <div className="news-meta"><span>{post.version}</span><time dateTime={post.date}>{formatDate(post.date)}</time></div>;
}

export default function News() {
  const [posts, setPosts] = useState(newsPosts);

  useEffect(() => {
    fetch(GITHUB_ISSUES, { headers: { Accept: "application/vnd.github+json" } })
      .then((response) => response.ok ? response.json() : [])
      .then((issues) => {
        const published = issues
          .filter((issue) => !issue.pull_request && issue.title?.startsWith("News:") && issue.state === "closed")
          .map(issuePost);
        setPosts([...published, ...newsPosts].sort((a, b) => b.date.localeCompare(a.date)));
      })
      .catch(() => {});
  }, []);

  const [featured, ...archive] = posts;

  return (
    <div className="site-shell news-site" id="top">
      <NewsHeader />
      <main className="news-main">
        <header className="news-intro">
          <p className="section-kicker">NEKOHUB / NEWS</p>
          <h1>Updates from<br /><em>the terminal.</em></h1>
          <p>Release notes, product updates, and field notes from nekoHub.</p>
        </header>

        {featured ? (
          <>
            <section className="news-latest" aria-labelledby="latest-update-heading">
              <div className="news-section-label"><h2 id="latest-update-heading">Latest update</h2><span>01 / {String(posts.length).padStart(2, "0")}</span></div>
              <article className="news-featured">
                <PostMeta post={featured} />
                <h3><Link to={`/news/${featured.slug}`}>{featured.title}</Link></h3>
                <p className="news-summary">{featured.summary}</p>
                <Link className="news-read" to={`/news/${featured.slug}`}>Read update <span aria-hidden="true">↗</span></Link>
              </article>
            </section>

            <section className="news-archive" aria-labelledby="archive-heading">
              <div className="news-section-label"><h2 id="archive-heading">Earlier updates</h2><span>ARCHIVE</span></div>
              {archive.length ? <div className="news-list">{archive.map((post) => (
                <article className="news-row" key={post.slug}>
                  <PostMeta post={post} />
                  <div><h3><Link to={`/news/${post.slug}`}>{post.title}</Link></h3><p>{post.summary}</p></div>
                  <Link className="news-row-arrow" to={`/news/${post.slug}`} aria-label={`Read ${post.title}`}>↗</Link>
                </article>
              ))}</div> : <p className="news-empty">More nekoHub updates will appear here.</p>}
            </section>
          </>
        ) : (
          <p className="news-empty">There are no updates yet.</p>
        )}
      </main>
      <footer><DotField className="footer-dots"/><BrandLogo/><p>Linux fleet management, designed for the terminal.</p><div><Link to="/">Home</Link><a href="https://github.com/awakyy1/nekohub">GitHub</a><a href="https://awakyy1.github.io/nekohub">APT</a><a href="#top">Back to top ↑</a></div></footer>
    </div>
  );
}
