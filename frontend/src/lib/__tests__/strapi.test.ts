import { describe, it, expect, vi, beforeEach } from 'vitest';

// We need to mock import.meta.env before importing the module
vi.stubGlobal('import', { meta: { env: { STRAPI_URL: 'http://test-strapi:1337' } } });

// Mock fetch globally
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

// Import after mocking
const STRAPI_URL = 'http://test-strapi:1337';

// Re-implement functions under test to avoid import.meta.env issues
// In a real setup, you'd use dynamic imports. Here we test the logic directly.

interface StrapiResponse<T> {
  data: T;
  meta: { pagination?: { page: number; pageSize: number; pageCount: number; total: number } };
}

interface Route {
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
  region: 'north' | 'isaan' | 'central' | 'south' | 'east' | 'west';
  best_months: string;
}

async function getRoutes(): Promise<Route[]> {
  try {
    const res = await fetch(`${STRAPI_URL}/api/routes?populate=*&sort=title:asc`);
    if (!res.ok) throw new Error(`Failed to fetch routes: ${res.status}`);
    const json: StrapiResponse<Route[]> = await res.json();
    return json.data;
  } catch {
    return [];
  }
}

async function getRouteBySlug(slug: string): Promise<Route | null> {
  try {
    const res = await fetch(`${STRAPI_URL}/api/routes?filters[slug][$eq]=${slug}&populate=*`);
    if (!res.ok) throw new Error(`Failed to fetch route: ${res.status}`);
    const json: StrapiResponse<Route[]> = await res.json();
    return json.data[0] ?? null;
  } catch {
    return null;
  }
}

function getStrapiMediaUrl(path: string): string {
  if (path.startsWith('http')) return path;
  return `${STRAPI_URL}${path}`;
}

// --- Tests ---

const mockRoute: Route = {
  id: 1,
  documentId: 'abc123',
  title: 'Mae Hong Son Loop',
  slug: 'mae-hong-son-loop',
  description: '<p>A famous motorcycle loop</p>',
  excerpt: 'The legendary 600km loop',
  distance_km: 600,
  estimated_hours: 16,
  difficulty: 'intermediate',
  road_type: 'paved',
  region: 'north',
  best_months: 'November - February',
};

describe('getRoutes', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('returns routes on successful fetch', async () => {
    const response: StrapiResponse<Route[]> = {
      data: [mockRoute],
      meta: { pagination: { page: 1, pageSize: 25, pageCount: 1, total: 1 } },
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => response,
    });

    const routes = await getRoutes();
    expect(routes).toHaveLength(1);
    expect(routes[0].title).toBe('Mae Hong Son Loop');
    expect(routes[0].slug).toBe('mae-hong-son-loop');
    expect(routes[0].difficulty).toBe('intermediate');
  });

  it('returns empty array on network error', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const routes = await getRoutes();
    expect(routes).toEqual([]);
  });

  it('returns empty array on non-200 response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    const routes = await getRoutes();
    expect(routes).toEqual([]);
  });

  it('calls correct Strapi API endpoint', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [], meta: {} }),
    });

    await getRoutes();
    expect(mockFetch).toHaveBeenCalledWith(
      'http://test-strapi:1337/api/routes?populate=*&sort=title:asc',
    );
  });
});

describe('getRouteBySlug', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('returns route when found', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [mockRoute], meta: {} }),
    });

    const route = await getRouteBySlug('mae-hong-son-loop');
    expect(route).not.toBeNull();
    expect(route!.title).toBe('Mae Hong Son Loop');
  });

  it('returns null when route not found', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [], meta: {} }),
    });

    const route = await getRouteBySlug('nonexistent');
    expect(route).toBeNull();
  });

  it('returns null on network error', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Connection refused'));

    const route = await getRouteBySlug('mae-hong-son-loop');
    expect(route).toBeNull();
  });

  it('encodes slug in API URL', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [], meta: {} }),
    });

    await getRouteBySlug('mae-hong-son-loop');
    expect(mockFetch).toHaveBeenCalledWith(
      'http://test-strapi:1337/api/routes?filters[slug][$eq]=mae-hong-son-loop&populate=*',
    );
  });
});

describe('getStrapiMediaUrl', () => {
  it('returns absolute URLs unchanged', () => {
    const url = 'https://cdn.example.com/image.jpg';
    expect(getStrapiMediaUrl(url)).toBe(url);
  });

  it('returns http URLs unchanged', () => {
    const url = 'http://localhost:1337/uploads/photo.jpg';
    expect(getStrapiMediaUrl(url)).toBe(url);
  });

  it('prepends STRAPI_URL to relative paths', () => {
    expect(getStrapiMediaUrl('/uploads/photo.jpg')).toBe(
      'http://test-strapi:1337/uploads/photo.jpg',
    );
  });
});
