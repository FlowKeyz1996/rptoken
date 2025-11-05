/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: false,
    esmExternals: "loose",
  },
  transpilePackages: [
    "@vanilla-extract/sprinkles",
    "@rainbow-me/rainbowkit",
    "@reown/appkit",
    "@walletconnect/ethereum-provider",
    "@walletconnect/universal-provider",
    "@base-org/account", // ✅ Added
  ],
  webpack: (config, { isServer }) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
      stream: false,
      http: false,
      https: false,
      zlib: false,
      path: false,
      os: false,
    };

    if (!config.externals) config.externals = [];
    config.externals.push({
      "utf-8-validate": "commonjs utf-8-validate",
      bufferutil: "commonjs bufferutil",
    });

    config.module.rules.push({
      test: /\.js$/,
      include: /node_modules\/@base-org\/account/,
      use: {
        loader: "babel-loader",
        options: {
          presets: ["next/babel"],
          plugins: [["@babel/plugin-syntax-import-assertions"]],
        },
      },
    });

    config.module.rules.push({
      test: /\.m?js$/,
      type: "javascript/auto",
      resolve: { fullySpecified: false },
    });

    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: "javascript/auto",
    });

    return config;
  },
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
