// @ts-check

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  env: {
    deployUrl: process.env.DEPLOY_URL || process.env.URL, // Provided by Netlify during build
  },
};

module.exports = nextConfig;
