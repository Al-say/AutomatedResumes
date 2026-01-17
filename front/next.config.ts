import type { NextConfig } from "next";

// 读取服务器配置
const serverConfig = require('./server.config.js');

const nextConfig: NextConfig = {
  // 将API配置暴露给客户端
  env: {
    API_BASE_URL: serverConfig.api.baseUrl,
    APP_NAME: serverConfig.app.name,
    APP_VERSION: serverConfig.app.version,
  },

  // 实验性功能优化
  experimental: {
    // 实验性功能配置
  },

  // 编译器优化
  compiler: {
    // 移除React开发模式标识
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn']
    } : false,
  },

  // 图片优化
  images: {
    // 允许的图片域名
    domains: ['localhost'],
    // 图片优化设置
    formats: ['image/webp', 'image/avif'],
    // 设备像素比
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Webpack优化
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // 优化构建性能
    if (!dev && !isServer) {
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        // 将Radix UI组件分离到单独的chunk
        radix: {
          test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
          name: 'radix-ui',
          chunks: 'all',
          priority: 10,
        },
        // 将Chart.js分离
        chartjs: {
          test: /[\\/]node_modules[\\/]chart\.js[\\/]/,
          name: 'chart-js',
          chunks: 'all',
          priority: 10,
        },
        // 将Framer Motion分离
        framer: {
          test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
          name: 'framer-motion',
          chunks: 'all',
          priority: 10,
        },
      };
    }

    // 添加bundle分析器（仅开发环境）
    if (dev && !isServer && process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'server',
          openAnalyzer: true,
        })
      );
    }

    return config;
  },

  // 只在生产环境使用静态导出
  ...(process.env.NODE_ENV === 'production' && {
    output: 'export',
    images: {
      unoptimized: true,
    },
    // 生产环境优化
    trailingSlash: true,
    skipTrailingSlashRedirect: true,
    skipMiddlewareUrlNormalize: true,
  }),

  // 开发环境优化
  ...(process.env.NODE_ENV === 'development' && {
    // 启用React严格模式
    reactStrictMode: true,
    // 启用SWC编译器
    swcMinify: true,
  }),

  // 性能监控
  onDemandEntries: {
    // 页面在内存中保留的时间
    maxInactiveAge: 25 * 1000,
    // 同时保留的页面数量
    pagesBufferLength: 2,
  },

  // 压缩和优化
  compress: true,

  // 安全头
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
