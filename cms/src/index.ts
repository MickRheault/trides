// Register custom MIME types for geo files
const customMimeTypes: Record<string, string> = {
  gpx: 'application/gpx+xml',
  kml: 'application/vnd.google-earth.kml+xml',
  kmz: 'application/vnd.google-earth.kmz',
};

export default {
  /**
   * Register custom MIME types so Strapi's upload plugin
   * accepts GPX, KML, and KMZ files.
   */
  register() {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const mime = require('mime-types');
      for (const [ext, type] of Object.entries(customMimeTypes)) {
        mime.types[ext] = type;
        mime.extensions[type] = [ext];
      }
    } catch {
      // mime-types not available, skip custom MIME registration
    }
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   */
  bootstrap() {},
};
