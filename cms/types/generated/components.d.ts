import type { Schema, Struct } from '@strapi/strapi';

export interface MapPoi extends Struct.ComponentSchema {
  collectionName: 'components_map_pois';
  info: {
    description: 'Point of Interest along a route';
    displayName: 'POI';
    icon: 'pinMap';
  };
  attributes: {
    description: Schema.Attribute.Text;
    google_maps_url: Schema.Attribute.String;
    latitude: Schema.Attribute.Decimal;
    longitude: Schema.Attribute.Decimal;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    type: Schema.Attribute.Enumeration<
      ['fuel', 'viewpoint', 'food', 'accommodation', 'attraction', 'warning']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'attraction'>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'map.poi': MapPoi;
    }
  }
}
