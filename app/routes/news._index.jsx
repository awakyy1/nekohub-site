import { Link } from "@remix-run/react";
import BrandLogo from "../components/BrandLogo";
import DotField from "../components/DotField";
import NewsHeader from "../components/NewsHeader";
import { newsPosts } from "../content/news";

export const meta = () => [
  { title: "News and updates | nekoHub" },
  { name: "description", content: "Release notes and updates from nekoHub, the Linux fleet management TUI." }
];

function formatDate(date) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));
}

function PostMeta({ post }) {
  return <div className="news-meta"><span className="news-category">{post.category}</span><span>{post.version}</span><time dateTime={post.date}>{formatDate(post.date)}</time></div>;
}

export default function News() {
  const [featured, ...archive] = newsPosts;

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
              <div className="news-section-label"><h2 id="latest-update-heading">Latest update</h2><span>01 / {String(newsPosts.length).padStart(2, "0")}</span></div>
              <article className="news-featured">
                <PostMeta post={featured} />
                <p className="news-overline">NEKOHUB RELEASE</p>
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
          <p className="news-empty">There are no updates yet. Add a post in <code>app/content/news.js</code> to publish one here.</p>
        )}
      </main>
      <footer><DotField className="footer-dots"/><BrandLogo/><p>Linux fleet management, designed for the terminal.</p><div><Link to="/">Home</Link><a href="https://github.com/awakyy1/nekohub">GitHub</a><a href="https://awakyy1.github.io/nekohub">APT</a><a href="#top">Back to top ↑</a></div></footer>
    </div>
  );
}
