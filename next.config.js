/**
 * @type {import('next').NextConfig}
 */
module.exports = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: [
      "y60keflha80zcrju.public.blob.vercel-storage.com",
      "public.blob.vercel-storage.com",
      "res.cloudinary.com",
      "abs.twimg.com",
      "pbs.twimg.com",
      "avatars.githubusercontent.com",
      "www.google.com",
      "flag.vercel.app",
      "illustrations.popsy.co",
    ],
  },
  reactStrictMode: false,
};
