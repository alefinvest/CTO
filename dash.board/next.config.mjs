import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin("./src/core/i18n/i18n.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverComponentsExternalPackages: ['grammy'],
    },
    env: {
        TON_CONNECT_PROJECT_ID: process.env.NEXT_PUBLIC_TON_CONNECT_PROJECT_ID,
        TONCENTER_API_KEY: process.env.TONCENTER_API_KEY,
    },
};

export default withNextIntl(nextConfig);