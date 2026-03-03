import type { Core } from '@strapi/strapi';
import mime from 'mime-types';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * Register custom MIME types so Strapi's upload plugin
   * accepts GPX, KML, and KMZ files.
   */
  register({ strapi }: { strapi: Core.Strapi }) {
    // Register GPX and other geo file MIME types
    mime.types['gpx'] = 'application/gpx+xml';
    mime.extensions['application/gpx+xml'] = 'gpx';

    mime.types['kml'] = 'application/vnd.google-earth.kml+xml';
    mime.extensions['application/vnd.google-earth.kml+xml'] = 'kml';

    mime.types['kmz'] = 'application/vnd.google-earth.kmz';
    mime.extensions['application/vnd.google-earth.kmz'] = 'kmz';
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   */
  bootstrap(/* { strapi }: { strapi: Core.Strapi } */) { },
};
