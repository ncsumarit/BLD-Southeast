import path from 'path';
import { fileURLToPath } from 'url';

import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import partytown from '@astrojs/partytown';
import icon from 'astro-icon';
import compress from 'astro-compress';
import type { AstroIntegration } from 'astro';

import astrowind from './vendor/integration';

import { readingTimeRemarkPlugin, responsiveTablesRehypePlugin, lazyImagesRehypePlugin } from './src/utils/frontmatter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const hasExternalScripts = false;
const whenExternalScripts = (items: (() => AstroIntegration) | (() => AstroIntegration)[] = []) =>
  hasExternalScripts ? (Array.isArray(items) ? items.map((item) => item()) : [items()]) : [];

export default defineConfig({
  output: 'static',

  // Respect an externally-assigned port (e.g. the preview harness) instead
  // of Vite's silent auto-increment, which can drift from what a proxy
  // expects to be listening on.
  server: {
    port: process.env.PORT ? Number(process.env.PORT) : 4321,
  },

  // Project-wide policy (see CLAUDE.md "Trailing Slash Enforcement").
  // All internal links, canonicals, OG URLs, and sitemap entries must end with "/".
  trailingSlash: 'always',

  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap(),
    mdx(),
    icon({
      include: {
        tabler: ['*'],
        'flat-color-icons': [
          'template',
          'gallery',
          'approval',
          'document',
          'advertising',
          'currency-exchange',
          'voice-presentation',
          'business-contact',
          'database',
        ],
      },
    }),

    ...whenExternalScripts(() =>
      partytown({
        config: { forward: ['dataLayer.push'] },
      })
    ),

    compress({
      CSS: true,
      HTML: {
        'html-minifier-terser': {
          removeAttributeQuotes: false,
        },
      },
      Image: false,
      JavaScript: true,
      SVG: false,
      Logger: 1,
    }),

    astrowind({
      config: './src/config.yaml',
    }),
  ],

  image: {
    domains: ['cdn.pixabay.com'],
  },

  markdown: {
    remarkPlugins: [readingTimeRemarkPlugin],
    rehypePlugins: [responsiveTablesRehypePlugin, lazyImagesRehypePlugin],
  },

  vite: {
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './src'),
      },
    },
  },
});
