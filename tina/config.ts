/**
 * TinaCMS content model for the BLD Southeast 2026 landing page.
 *
 * Single structured content file (content/landing.json) backs the entire
 * page — every section component's props are sourced from here. Astro
 * imports this JSON directly at build time (see src/pages/index.astro), so
 * `npm run build` always works standalone, with or without Tina/TinaCloud
 * reachable.
 *
 * LOCAL MODE: clientId/token are undefined until the operator sets
 * TINA_CLIENT_ID + TINA_TOKEN (see .env.example). Local mode (no cloud
 * credentials) still gives full visual editing against the local
 * filesystem/git — TinaCloud is only needed for hosted editing on the
 * live deployed site.
 */
import { defineConfig } from 'tinacms';

const branch =
  process.env.GITHUB_BRANCH || process.env.HEAD || process.env.VERCEL_GIT_COMMIT_REF || 'main';

const linkFields = () => [
  { type: 'string' as const, name: 'label', label: 'Label' },
  { type: 'string' as const, name: 'href', label: 'URL' },
];

export default defineConfig({
  branch,

  // Set via TINA_CLIENT_ID / TINA_TOKEN env vars once the operator connects
  // this repo on app.tina.io. Left undefined = LOCAL MODE (works now).
  clientId: process.env.TINA_CLIENT_ID || undefined,
  token: process.env.TINA_TOKEN || undefined,

  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },
  media: {
    tina: {
      mediaRoot: 'images',
      publicFolder: 'public',
    },
  },

  schema: {
    collections: [
      {
        name: 'landing',
        label: 'Landing Page',
        path: 'content',
        format: 'json',
        // Single content file, not a folder of many — disable create/delete
        // so editors can only edit the one page, never fork/duplicate it.
        match: { include: 'landing' },
        ui: {
          allowedActions: { create: false, delete: false },
          router: () => '/',
        },
        fields: [
          {
            type: 'object',
            name: 'seo',
            label: 'SEO / Meta',
            fields: [
              { type: 'string', name: 'title', label: 'Page Title' },
              { type: 'string', name: 'description', label: 'Meta Description', ui: { component: 'textarea' } },
            ],
          },
          {
            type: 'object',
            name: 'hero',
            label: 'Hero',
            fields: [
              { type: 'string', name: 'eyebrow', label: 'Eyebrow' },
              {
                type: 'string',
                name: 'headline',
                label: 'Headline',
                ui: { component: 'textarea' },
              },
              { type: 'string', name: 'dateLine', label: 'Date Line' },
              { type: 'string', name: 'locationLine', label: 'Location Line' },
              { type: 'object', name: 'primaryCta', label: 'Primary CTA (Get Your Ticket)', fields: linkFields() },
              { type: 'object', name: 'secondaryCta', label: 'Secondary CTA (Apply to Speak)', fields: linkFields() },
              { type: 'object', name: 'tertiaryCta', label: 'Tertiary CTA (Book Your Stay)', fields: linkFields() },
              { type: 'image', name: 'heroImage', label: 'Hero Image' },
              { type: 'string', name: 'heroImageAlt', label: 'Hero Image Alt Text' },
            ],
          },
          {
            type: 'object',
            name: 'about',
            label: 'About',
            fields: [
              { type: 'string', name: 'heading', label: 'Heading' },
              {
                type: 'string',
                name: 'body',
                label: 'Body (source paragraph — verbatim)',
                ui: { component: 'textarea' },
              },
              {
                type: 'string',
                name: 'bodySecondary',
                label: 'Body — second paragraph (optional, operator-supplied)',
                ui: {
                  component: 'textarea',
                  description: 'Left empty on purpose. Add a second paragraph here only with real, operator-approved copy.',
                },
              },
              { type: 'image', name: 'image', label: 'Image' },
              { type: 'string', name: 'imageAlt', label: 'Image Alt Text' },
            ],
          },
          {
            type: 'object',
            name: 'whyAttend',
            label: 'Why Attend',
            fields: [
              { type: 'string', name: 'heading', label: 'Heading' },
              { type: 'string', name: 'intro', label: 'Intro', ui: { component: 'textarea' } },
              {
                type: 'object',
                name: 'benefits',
                label: 'Benefits',
                list: true,
                ui: {
                  description:
                    'PLACEHOLDER COPY — replace with real reasons to attend before launch. These are first-pass AI-drafted benefits, not operator-confirmed content.',
                  itemProps: (item) => ({ label: item?.title || 'New benefit' }),
                },
                fields: [
                  { type: 'string', name: 'title', label: 'Title' },
                  { type: 'string', name: 'description', label: 'Description', ui: { component: 'textarea' } },
                ],
              },
            ],
          },
          {
            type: 'object',
            name: 'agenda',
            label: 'Agenda',
            fields: [
              { type: 'string', name: 'heading', label: 'Heading' },
              { type: 'boolean', name: 'show', label: 'Show this section' },
              { type: 'string', name: 'placeholderNote', label: 'Placeholder Note (shown when no days added yet)' },
              {
                type: 'object',
                name: 'days',
                label: 'Days',
                list: true,
                ui: { itemProps: (item) => ({ label: item?.label || 'New day' }) },
                fields: [
                  { type: 'string', name: 'label', label: 'Day Label (e.g. "Day 1 — Sept 16")' },
                  {
                    type: 'object',
                    name: 'sessions',
                    label: 'Sessions',
                    list: true,
                    ui: { itemProps: (item) => ({ label: item?.title || 'New session' }) },
                    fields: [
                      { type: 'string', name: 'time', label: 'Time' },
                      { type: 'string', name: 'title', label: 'Title' },
                      { type: 'string', name: 'description', label: 'Description', ui: { component: 'textarea' } },
                    ],
                  },
                ],
              },
            ],
          },
          {
            type: 'object',
            name: 'speakers',
            label: 'Speakers',
            fields: [
              { type: 'string', name: 'heading', label: 'Heading' },
              { type: 'string', name: 'intro', label: 'Intro', ui: { component: 'textarea' } },
              { type: 'boolean', name: 'show', label: 'Show this section' },
              { type: 'string', name: 'placeholderNote', label: 'Placeholder Note (shown until speakers are announced)' },
              { type: 'object', name: 'applyCta', label: 'Apply to Speak CTA', fields: linkFields() },
              {
                type: 'object',
                name: 'speakers',
                label: 'Speakers',
                list: true,
                ui: { itemProps: (item) => ({ label: item?.name || 'New speaker' }) },
                fields: [
                  { type: 'string', name: 'name', label: 'Name' },
                  { type: 'string', name: 'title', label: 'Title' },
                  { type: 'string', name: 'org', label: 'Organization' },
                  { type: 'image', name: 'photo', label: 'Photo' },
                  { type: 'string', name: 'bio', label: 'Bio', ui: { component: 'textarea' } },
                ],
              },
            ],
          },
          {
            type: 'object',
            name: 'beneficiaries',
            label: 'Beneficiaries',
            fields: [
              { type: 'string', name: 'heading', label: 'Heading' },
              {
                type: 'object',
                name: 'logos',
                label: 'Beneficiary Logos',
                list: true,
                ui: { itemProps: (item) => ({ label: item?.name || 'New beneficiary' }) },
                fields: [
                  { type: 'string', name: 'name', label: 'Name' },
                  { type: 'image', name: 'logo', label: 'Logo' },
                  { type: 'string', name: 'url', label: 'URL (optional)' },
                ],
              },
            ],
          },
          {
            type: 'object',
            name: 'sponsors',
            label: 'Sponsors',
            fields: [
              { type: 'string', name: 'heading', label: 'Heading' },
              { type: 'string', name: 'intro', label: 'Intro (optional)' },
              {
                type: 'object',
                name: 'tiers',
                label: 'Tiers',
                list: true,
                ui: { itemProps: (item) => ({ label: item?.label || 'New tier' }) },
                fields: [
                  {
                    type: 'string',
                    name: 'tier',
                    label: 'Tier',
                    options: ['gold', 'silver', 'bronze'],
                  },
                  { type: 'string', name: 'label', label: 'Tier Label (shown on page)' },
                  {
                    type: 'object',
                    name: 'sponsors',
                    label: 'Sponsors',
                    list: true,
                    ui: { itemProps: (item) => ({ label: item?.name || 'New sponsor' }) },
                    fields: [
                      { type: 'string', name: 'name', label: 'Name' },
                      { type: 'image', name: 'logo', label: 'Logo' },
                      { type: 'string', name: 'url', label: 'URL (optional)' },
                      {
                        type: 'boolean',
                        name: 'darkCard',
                        label: 'Dark card background',
                        description:
                          'Only enable if the logo file has a baked-in dark/solid background (not transparent) — renders the tile on a dark card instead of white so it does not clash.',
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            type: 'object',
            name: 'travelStay',
            label: 'Travel & Stay',
            fields: [
              { type: 'string', name: 'heading', label: 'Heading' },
              { type: 'string', name: 'venueNote', label: 'Venue Note (to-confirm caveat)', ui: { component: 'textarea' } },
              { type: 'string', name: 'partnerUrl', label: 'Booking Partner URL (TripZero)' },
              {
                type: 'object',
                name: 'venue',
                label: 'Venue',
                fields: [
                  { type: 'string', name: 'name', label: 'Name' },
                  { type: 'string', name: 'address', label: 'Address' },
                  { type: 'string', name: 'neighborhood', label: 'Neighborhood' },
                  { type: 'string', name: 'metro', label: 'Metro / Transit' },
                ],
              },
              {
                type: 'object',
                name: 'airports',
                label: 'Airports',
                list: true,
                ui: { itemProps: (item) => ({ label: item?.code || 'New airport' }) },
                fields: [
                  { type: 'string', name: 'code', label: 'Airport Code' },
                  { type: 'string', name: 'name', label: 'Airport Name' },
                  { type: 'string', name: 'transit', label: 'Transit Notes', ui: { component: 'textarea' } },
                ],
              },
              {
                type: 'object',
                name: 'hotels',
                label: 'Hotels',
                list: true,
                ui: { itemProps: (item) => ({ label: item?.name || 'New hotel' }) },
                fields: [
                  { type: 'string', name: 'name', label: 'Name' },
                  { type: 'string', name: 'neighborhood', label: 'Neighborhood' },
                  { type: 'number', name: 'walkMin', label: 'Walk Time to Venue (min)' },
                  { type: 'string', name: 'rate', label: 'Rate' },
                  { type: 'string', name: 'bookHref', label: 'Booking URL' },
                  { type: 'string', name: 'phone', label: 'Phone' },
                  { type: 'string', name: 'notes', label: 'Notes' },
                ],
              },
              { type: 'string', name: 'bookingDeadline', label: 'Booking Deadline' },
              { type: 'string', name: 'carbonOffsetNote', label: 'Carbon Offset Note', ui: { component: 'textarea' } },
            ],
          },
          {
            type: 'object',
            name: 'registerCta',
            label: 'Register CTA',
            fields: [
              { type: 'string', name: 'heading', label: 'Heading' },
              { type: 'string', name: 'subhead', label: 'Subhead' },
              { type: 'object', name: 'cta', label: 'CTA (Register)', fields: linkFields() },
              { type: 'image', name: 'backgroundImage', label: 'Background Image' },
            ],
          },
          {
            type: 'object',
            name: 'footer',
            label: 'Footer',
            fields: [
              {
                type: 'string',
                name: 'contactEmail',
                label: 'Contact Email',
                ui: { description: 'Empty — operator will add.' },
              },
              {
                type: 'object',
                name: 'socialLinks',
                label: 'Social Links',
                list: true,
                ui: {
                  description: 'Empty — operator will add.',
                  itemProps: (item) => ({ label: item?.platform || 'New social link' }),
                },
                fields: [
                  { type: 'string', name: 'platform', label: 'Platform' },
                  { type: 'string', name: 'url', label: 'URL' },
                ],
              },
              { type: 'string', name: 'copyright', label: 'Copyright' },
            ],
          },
        ],
      },
    ],
  },
});
