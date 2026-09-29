// Add new entries at the top of this list to publish updates on /news.
// Dates use YYYY-MM-DD. Supported body blocks: paragraph, heading, code, link.
export const newsPosts = [
  {
    slug: "nekohub-0-13-0",
    date: "2026-09-28",
    category: "Release",
    version: "v0.13.0",
    title: "nekoHub v0.13.0 is now available",
    summary: "The latest stable build is published for Debian, Ubuntu, and compatible amd64 distributions through the official APT repository.",
    releaseUrl: "https://github.com/awakyy1/nekohub/releases/tag/v0.13.0",
    body: [
      { type: "paragraph", text: "nekoHub v0.13.0 is available as signed packages through the official APT repository." },
      { type: "paragraph", text: "Install it on Debian, Ubuntu, and compatible derivatives running on amd64. If you already configured the repository, update the package index and install nekoHub:" },
      { type: "code", text: "sudo apt update\nsudo apt install nekohub" },
      { type: "link", text: "See the full installation instructions", href: "/#install" }
    ]
  },
  {
    slug: "embedded-ssh-terminal",
    date: "2026-09-28",
    category: "Release",
    version: "v0.12.0",
    title: "Open an SSH terminal from nekoHub",
    summary: "The v0.12.0 release adds an embedded SSH terminal, bringing remote shell access into the nekoHub workflow.",
    releaseUrl: "https://github.com/awakyy1/nekohub/releases/tag/v0.12.0",
    body: [
      { type: "paragraph", text: "nekoHub v0.12.0 adds an embedded SSH terminal for working with remote machines from the application." },
      { type: "paragraph", text: "The terminal builds on nekoHub's OpenSSH based host workflow, so you can reach a machine's shell without switching to a separate terminal window." }
    ]
  }
];

export const newsBySlug = Object.fromEntries(newsPosts.map((post) => [post.slug, post]));
