/**
 * Sanity Schema Index
 *
 * All content types for local service business sites.
 * Deployed to each client's Sanity project by the cms-setup agent (Step 8).
 */

import page from './page';
import service from './service';
import serviceArea from './serviceArea';
import blogPost from './blogPost';
import siteSettings from './siteSettings';

export const schemaTypes = [page, service, serviceArea, blogPost, siteSettings];
