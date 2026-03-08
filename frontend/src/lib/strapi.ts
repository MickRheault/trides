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

export interface POI {
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
  type: 'fuel' | 'viewpoint' | 'food' | 'accommodation' | 'attraction' | 'warning';
  google_maps_url?: string;
}

export interface Province {
  id: number;
  name: string;
  name_thai?: string;
  region: 'north' | 'northeast' | 'central' | 'south';
}

export interface RoadType {
  id: number;
  documentId: string;
  name: string;
}

export interface Motorcycle {
  id: number;
  documentId: string;
  name: string;
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
  road_types?: RoadType[];
  motorcycles?: Motorcycle[];
  region: 'north' | 'northeast' | 'central' | 'south';
  google_maps_url?: string;
  hero_image?: {
    url: string;
    alternativeText?: string;
  };
  gpx_file?: string;
  gpx_files?: Array<{
    url: string;
    name: string;
  }>;
  gallery?: Array<{
    url: string;
    alternativeText?: string;
  }>;
  pois?: POI[];
  provinces?: Province[];
}

/**
 * Fetch all routes from Strapi
 */
export async function getRoutes(): Promise<Route[]> {
  try {
    const res = await fetch(
      `${STRAPI_URL}/api/routes?populate[road_types]=*&populate[motorcycles]=*&populate[hero_image]=*&populate[gallery]=*&populate[pois]=*&populate[provinces]=*&sort=title:asc`
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
      `${STRAPI_URL}/api/routes?filters[slug][$eq]=${slug}&populate[road_types]=*&populate[motorcycles]=*&populate[hero_image]=*&populate[gallery]=*&populate[pois]=*&populate[provinces]=*`
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
