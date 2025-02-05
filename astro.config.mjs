import { defineConfig, sharpImageService } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import { readFileSync } from "node:fs";
import icon from "astro-icon";
import expressiveCode from "astro-expressive-code";
import mdx from "@astrojs/mdx";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { remarkReadingTime } from "./remark-reading-time.mjs";
import react from "@astrojs/react";

/** @type {import('astro-expressive-code').AstroExpressiveCodeOptions} */
const astroExpressiveCodeOptions = {
  themes: ["min-dark", "min-light"],
};

export default defineConfig({
  server: {
    host: '0.0.0.0'
  },
  markdown: {
    remarkPlugins: [remarkReadingTime],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: "prepend",
          content: {
            type: "text",
            value: "#",
          },
          headingProperties: {
            className: ["anchor"],
          },
          properties: {
            className: ["anchor-link mr-5"],
          },
        },
      ],
    ],
  },
  integrations: [
    (await import("astro-compress")).default({
      CSS: false,
      SVG: false,
    }),
    tailwind(),
    sitemap(),
    expressiveCode(astroExpressiveCodeOptions),
    icon(),
    mdx(),
    react(),
  ],
  image: {
    service: sharpImageService({
      quality: 80,
      format: ['webp', 'avif'],
      formatOptions: {
        webp: {
          quality: 80,
          lossless: false,
          effort: 6
        },
        avif: {
          quality: 80,
          lossless: false,
          effort: 6
        }
      }
    }),
  },
  site: "https://evolvedthre.at",
  vite: {
    plugins: [rawFonts([".ttf", ".woff"])],
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
    resolve: {
      alias: {
        "~": "/src"
      }
    }
  },
});

// vite plugin to import fonts
function rawFonts(ext) {
  return {
    name: "vite-plugin-raw-fonts",
    transform(_, id) {
      if (ext.some((e) => id.endsWith(e))) {
        const buffer = readFileSync(id);
        return {
          code: `export default ${JSON.stringify(buffer)}`,
          map: null,
        };
      }
    },
  };
}
