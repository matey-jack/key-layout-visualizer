import {generateSeoContent} from "../src/seo-content.ts";
import * as fs from "node:fs";

const indexPath = process.argv[2] || "dist/index.html";

const html = fs.readFileSync(indexPath, "utf-8");
const seoContent = generateSeoContent();
const updatedHtml = html.replace("<!--SEO_CONTENT-->", seoContent);
fs.writeFileSync(indexPath, updatedHtml);

console.log(`Injected SEO content into ${indexPath}`);
