import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Plugin => ({
    upload: {
        config: {
            sizeLimit: 50 * 1024 * 1024, // 50MB
            // Use Cloudinary when credentials are set (production on Railway),
            // otherwise fall back to local storage (development).
            ...(env('CLOUDINARY_NAME')
                ? {
                    provider: 'cloudinary',
                    providerOptions: {
                        cloud_name: env('CLOUDINARY_NAME'),
                        api_key: env('CLOUDINARY_KEY'),
                        api_secret: env('CLOUDINARY_SECRET'),
                    },
                    actionOptions: {
                        upload: {
                            resource_type: 'auto', // Supports images, videos, AND raw files (GPX, KML)
                        },
                        uploadStream: {
                            resource_type: 'auto',
                        },
                        delete: {},
                    },
                }
                : {}),
        },
    },
});

export default config;
