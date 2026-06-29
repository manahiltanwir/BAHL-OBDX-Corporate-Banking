const path = require('path')

/** @type {import('next').NextConfig} */

// Remove this if you're not using Fullcalendar features
const withTM = require('next-transpile-modules')([])

module.exports = withTM({
  trailingSlash: true,
  reactStrictMode: false,
  images: {
    domains: [
      'firebasestorage.googleapis.com',
      'static-files-lms.s3.us-east-2.amazonaws.com',
      'greenentertainment.s3.amazonaws.com',
      'images.unsplash.com',
      'res.cloudinary.com',
      'cdn.dribbble.com',
      'png.pngtree.com'
    ]
  },
  // experimental: {
  //   esmExternals: false,
  //   jsconfigPaths: true // enables it for both jsconfig.json and tsconfig.json
  // },
  webpack: config => {
    config.resolve.alias = {
      ...config.resolve.alias,
    }

    return config
  }
})
