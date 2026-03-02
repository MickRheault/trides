/**
 * Strapi API helper for fetching route and content data.
 *
 * In development, set STRAPI_URL in your .env file:
 *   STRAPI_URL=http://localhost:1337
 *
 * In production, point it to your deployed Strapi instance.
 */

const STRAPI_URL = import.meta.env.STRAPI_URL || 'http://localhost:1337';

interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface Route {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  description: string;
  excerpt: string;
  distance_km: number;
  estimated_hours: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  road_type: 'paved' | 'mixed' | 'off-road';
  region: 'north' | 'northeast' | 'central' | 'south';
  best_months: string;
  hero_image?: {
    url: string;
    alternativeText?: string;
  };
  gpx_files?: Array<{
    url: string;
    name: string;
  }>;
  gallery?: Array<{
    url: string;
    alternativeText?: string;
  }>;
}

/**
 * Fetch all routes from Strapi
 */
export async function getRoutes(): Promise<Route[]> {
  try {
    const res = await fetch(
      `${STRAPI_URL}/api/routes?populate=*&sort=title:asc`
    );
    if (!res.ok) throw new Error(`Failed to fetch routes: ${res.status}`);
    const json: StrapiResponse<Route[]> = await res.json();
    return json.data;
  } catch (error) {
    console.warn('Could not fetch routes from Strapi:', error);
    return [];
  }
}

/**
 * Fetch a single route by slug
 */
export async function getRouteBySlug(slug: string): Promise<Route | null> {
  try {
    const res = await fetch(
      `${STRAPI_URL}/api/routes?filters[slug][$eq]=${slug}&populate=*`
    );
    if (!res.ok) throw new Error(`Failed to fetch route: ${res.status}`);
    const json: StrapiResponse<Route[]> = await res.json();
    return json.data[0] ?? null;
  } catch (error) {
    console.warn('Could not fetch route from Strapi:', error);
    return null;
  }
}

/**
 * Build a full media URL from a Strapi media path
 */
export function getStrapiMediaUrl(path: string): string {
  if (path.startsWith('http')) return path;
  return `${STRAPI_URL}${path}`;
}
