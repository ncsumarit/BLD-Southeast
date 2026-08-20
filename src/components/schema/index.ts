/**
 * Schema Component Index
 *
 * All JSON-LD schema components for local service business sites.
 * Import individual components in page layouts:
 *
 *   import EventSchema from '~/components/schema/EventSchema.astro';
 *   import BreadcrumbSchema from '~/components/schema/BreadcrumbSchema.astro';
 *
 * Required schema per page type:
 *
 * HOME:         Event, Organization, WebSite, Breadcrumb, (AggregateRating)
 * SERVICE:      Service, Breadcrumb, (FAQ)
 * SERVICE AREA: ServiceArea, Breadcrumb, (FAQ)
 * FAQ:          FAQ, Breadcrumb
 * BLOG POST:    Breadcrumb (Article schema handled by AstroWind's blog system)
 *
 * LocalBusinessSchema.astro was removed — unused (this is a single-event
 * landing site, not a local-service-business site) and it didn't
 * type-check cleanly against schema-dts's LocalBusiness union.
 */

// Re-exports for documentation only — Astro components must be imported directly
export {};
