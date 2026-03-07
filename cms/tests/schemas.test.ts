import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

function loadSchema(schemaPath: string) {
    const fullPath = path.resolve(__dirname, '..', schemaPath);
    const content = fs.readFileSync(fullPath, 'utf-8');
    return JSON.parse(content);
}

// --- Route Schema ---

describe('Route content type schema', () => {
    const schema = loadSchema('src/api/route/content-types/route/schema.json');

    it('is a collection type', () => {
        expect(schema.kind).toBe('collectionType');
        expect(schema.collectionName).toBe('routes');
    });

    it('has correct display info', () => {
        expect(schema.info.singularName).toBe('route');
        expect(schema.info.pluralName).toBe('routes');
        expect(schema.info.displayName).toBe('Route');
    });

    it('has draft and publish enabled', () => {
        expect(schema.options.draftAndPublish).toBe(true);
    });

    describe('required fields', () => {
        it('has title (string, required)', () => {
            expect(schema.attributes.title).toEqual({ type: 'string', required: true });
        });

        it('has slug (UID from title, required)', () => {
            expect(schema.attributes.slug.type).toBe('uid');
            expect(schema.attributes.slug.targetField).toBe('title');
            expect(schema.attributes.slug.required).toBe(true);
        });

        it('has difficulty enum with correct values', () => {
            expect(schema.attributes.difficulty.type).toBe('enumeration');
            expect(schema.attributes.difficulty.enum).toEqual(['beginner', 'intermediate', 'advanced']);
            expect(schema.attributes.difficulty.required).toBe(true);
        });

        it('has road_type enum with correct values', () => {
            expect(schema.attributes.road_type.type).toBe('enumeration');
            expect(schema.attributes.road_type.enum).toEqual(['paved', 'mixed', 'off-road']);
            expect(schema.attributes.road_type.required).toBe(true);
        });

        it('has region enum with correct values', () => {
            expect(schema.attributes.region.type).toBe('enumeration');
            expect(schema.attributes.region.enum).toEqual(['north', 'northeast', 'central', 'south']);
            expect(schema.attributes.region.required).toBe(true);
        });
    });

    describe('optional fields', () => {
        it('has description (richtext)', () => {
            expect(schema.attributes.description.type).toBe('richtext');
        });

        it('has excerpt (text)', () => {
            expect(schema.attributes.excerpt.type).toBe('text');
        });

        it('has distance_km (decimal)', () => {
            expect(schema.attributes.distance_km.type).toBe('decimal');
        });

        it('has estimated_hours (decimal)', () => {
            expect(schema.attributes.estimated_hours.type).toBe('decimal');
        });

        it('has best_months (string)', () => {
            expect(schema.attributes.best_months.type).toBe('string');
        });

        it('has google_maps_url (string)', () => {
            expect(schema.attributes.google_maps_url.type).toBe('string');
        });
    });

    describe('media fields', () => {
        it('has hero_image (single image)', () => {
            expect(schema.attributes.hero_image.type).toBe('media');
            expect(schema.attributes.hero_image.multiple).toBe(false);
            expect(schema.attributes.hero_image.allowedTypes).toEqual(['images']);
        });

        it('has gpx_files (multiple, no type restriction)', () => {
            expect(schema.attributes.gpx_files.type).toBe('media');
            expect(schema.attributes.gpx_files.multiple).toBe(true);
            expect(schema.attributes.gpx_files.allowedTypes).toBeUndefined();
        });

        it('has gallery (multiple images)', () => {
            expect(schema.attributes.gallery.type).toBe('media');
            expect(schema.attributes.gallery.multiple).toBe(true);
            expect(schema.attributes.gallery.allowedTypes).toEqual(['images']);
        });
    });

    describe('relations and components', () => {
        it('has pois as repeatable component', () => {
            expect(schema.attributes.pois.type).toBe('component');
            expect(schema.attributes.pois.repeatable).toBe(true);
            expect(schema.attributes.pois.component).toBe('map.poi');
        });

        it('has provinces as manyToMany relation', () => {
            expect(schema.attributes.provinces.type).toBe('relation');
            expect(schema.attributes.provinces.relation).toBe('manyToMany');
            expect(schema.attributes.provinces.target).toBe('api::province.province');
        });
    });
});

// --- Province Schema ---

describe('Province content type schema', () => {
    const schema = loadSchema('src/api/province/content-types/province/schema.json');

    it('is a collection type', () => {
        expect(schema.kind).toBe('collectionType');
        expect(schema.collectionName).toBe('provinces');
    });

    it('has draft and publish disabled', () => {
        expect(schema.options.draftAndPublish).toBe(false);
    });

    it('has name (required, unique)', () => {
        expect(schema.attributes.name.type).toBe('string');
        expect(schema.attributes.name.required).toBe(true);
        expect(schema.attributes.name.unique).toBe(true);
    });

    it('has name_thai (optional string)', () => {
        expect(schema.attributes.name_thai.type).toBe('string');
    });

    it('has region enum matching Route regions', () => {
        expect(schema.attributes.region.type).toBe('enumeration');
        expect(schema.attributes.region.enum).toEqual(['north', 'northeast', 'central', 'south']);
    });

    it('has routes as manyToMany relation back to Route', () => {
        expect(schema.attributes.routes.type).toBe('relation');
        expect(schema.attributes.routes.relation).toBe('manyToMany');
        expect(schema.attributes.routes.target).toBe('api::route.route');
        expect(schema.attributes.routes.mappedBy).toBe('provinces');
    });
});

// --- POI Component ---

describe('POI component schema', () => {
    const schema = loadSchema('src/components/map/poi.json');

    it('has correct collection name', () => {
        expect(schema.collectionName).toBe('components_map_pois');
    });

    it('has name (required string)', () => {
        expect(schema.attributes.name.type).toBe('string');
        expect(schema.attributes.name.required).toBe(true);
    });

    it('has latitude (optional decimal)', () => {
        expect(schema.attributes.latitude.type).toBe('decimal');
        expect(schema.attributes.latitude.required).toBeUndefined();
    });

    it('has longitude (optional decimal)', () => {
        expect(schema.attributes.longitude.type).toBe('decimal');
        expect(schema.attributes.longitude.required).toBeUndefined();
    });

    it('has type enum with all POI categories', () => {
        expect(schema.attributes.type.type).toBe('enumeration');
        expect(schema.attributes.type.enum).toEqual([
            'fuel', 'viewpoint', 'food', 'accommodation', 'attraction', 'warning',
        ]);
        expect(schema.attributes.type.required).toBe(true);
    });

    it('has google_maps_url (optional string)', () => {
        expect(schema.attributes.google_maps_url.type).toBe('string');
    });

    it('has description (optional text)', () => {
        expect(schema.attributes.description.type).toBe('text');
    });
});

// --- Cross-schema consistency ---

describe('Schema consistency', () => {
    const routeSchema = loadSchema('src/api/route/content-types/route/schema.json');
    const provinceSchema = loadSchema('src/api/province/content-types/province/schema.json');

    it('Route and Province region enums match', () => {
        expect(routeSchema.attributes.region.enum).toEqual(
            provinceSchema.attributes.region.enum
        );
    });

    it('Route→Province relation matches Province→Route inverse', () => {
        expect(routeSchema.attributes.provinces.target).toBe('api::province.province');
        expect(routeSchema.attributes.provinces.inversedBy).toBe('routes');
        expect(provinceSchema.attributes.routes.target).toBe('api::route.route');
        expect(provinceSchema.attributes.routes.mappedBy).toBe('provinces');
    });

    it('all schemas are valid JSON', () => {
        // If we got here without errors, all schemas loaded successfully
        expect(routeSchema).toBeDefined();
        expect(provinceSchema).toBeDefined();
    });
});
