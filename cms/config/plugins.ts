import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Plugin => ({
    upload: {
        config: {
            sizeLimit: 50 * 1024 * 1024, // 50MB
        },
    },
});

export default config;
