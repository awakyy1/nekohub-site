import fs from "node:fs/promises";

const target = new URL("../app/content/generated.js", import.meta.url);
const { CONTENTFUL_SPACE_ID: space, CONTENTFUL_ACCESS_TOKEN: token, CONTENTFUL_ENVIRONMENT = "master", CONTENTFUL_ENTRY_ID: entry } = process.env;
let content = null;
if (space && token && entry) {
  const url = `https://cdn.contentful.com/spaces/${space}/environments/${CONTENTFUL_ENVIRONMENT}/entries/${entry}?access_token=${token}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Contentful sync failed: ${response.status}`);
  content = (await response.json()).fields;
  console.log("Synced homepage content from Contentful.");
} else {
  console.log("Contentful credentials not set; using versioned fallback content.");
}
await fs.writeFile(target, `export default ${JSON.stringify(content, null, 2)};\n`);
