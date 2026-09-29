import { Link, useParams } from "@remix-run/react";
import BrandLogo from "../components/BrandLogo";
import DotField from "../components/DotField";
import NewsHeader from "../components/NewsHeader";
import { newsBySlug } from "../content/news";

export const meta = ({ params }) => {
  const post = newsBySlug[params.slug];
  return post
    ? [{ title: `${post.title} | nekoHub News` }, { name: "description", content: post.summary }]
    : [{ title: "Update not found | nekoHub News" }];
};

function formatDate(date) {
  return new Intl.DateTimeFormat("en", { dateStyle: "long", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));
}

function NewsBlock({ block }) {
  if (block.type === "heading") return <h2>{block.text}</h2>;
  if (block.type === "code") return <pre className="news-code"><code>{block.text}</code></pre>;
  if (block.type === "link") return <p><Link className="news-read" to={block.href}>{block.text} <span aria-hidden="true">↗</span></Link></p>;
  return <p>{block.text}</p>;
}

export default function NewsPost() {
  const { slug } = useParams();
  const post = newsBySlug[slug];

  return (
    <div className="site-shell news-site" id="top">
      <NewsHeader />
      <main className="news-main news-article-main">
        {post ? <article className="news-article">
          <Link className="news-back" to="/news">← All updates</Link>
          <div className="news-article-heading">
            <div className="news-meta"><span className="news-category">{post.category}</span><span>{post.version}</span><time dateTime={post.date}>{formatDate(post.date)}</time></div>
            <h1>{post.title}</h1>
            <p className="news-summary">{post.summary}</p>
          </div>
          <div className="news-body">{post.body.map((block, index) => <NewsBlock block={block} key={`${post.slug}-${index}`} />)}</div>
          <a className="news-release-link" href={post.releaseUrl} target="_blank" rel="noreferrer">View release on GitHub <span aria-hidden="true">↗</span></a>
        </article> : <section className="news-not-found"><p className="section-kicker">404 / UPDATE NOT FOUND</p><h1>This update<br /><em>isn't here.</em></h1><Link className="news-read" to="/news">Browse all updates <span aria-hidden="true">↗</span></Link></section>}
      </main>
      <footer><DotField className="footer-dots"/><BrandLogo/><p>Linux fleet management, designed for the terminal.</p><div><Link to="/">Home</Link><Link to="/news">News</Link><a href="https://github.com/awakyy1/nekohub">GitHub</a><a href="#top">Back to top ↑</a></div></footer>
    </div>
  );
}
