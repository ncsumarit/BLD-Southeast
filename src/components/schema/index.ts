/**
 * Schema Component Index
 *
 * All JSON-LD schema components for local service business sites.
 * Import individual components in page layouts:
 *
 *   import LocalBusinessSchema from '~/components/schema/LocalBusinessSchema.astro';
 *   import BreadcrumbSchema from '~/components/schema/BreadcrumbSchema.astro';
 *
 * Required schema per page type:
 *
 * HOME:         LocalBusiness, Organization, WebSite, Breadcrumb, (AggregateRating)
 * SERVICE:      Service, Breadcrumb, (FAQ)
 * SERVICE AREA: ServiceArea, Breadcrumb, (FAQ)
 * ABOUT:        LocalBusiness, Breadcrumb
 * CONTACT:      LocalBusiness, Breadcrumb
 * FAQ:          FAQ, Breadcrumb
 * BLOG POST:    Breadcrumb (Article schema handled by AstroWind's blog system)
 */

// Re-exports for documentation only — Astro components must be imported directly
export {};
