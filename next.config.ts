import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from "next";

const nextConfig: NextConfig = {};
 
const withNextIntl = createNextIntlPlugin('./src/i18n/requests.ts');
export default withNextIntl(nextConfig);