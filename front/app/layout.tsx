import type { Metadata, Viewport } from "next";
import "./globals.css";
import Sidebar from "./components/Sidebar";
import ContentArea from "./components/ContentArea";
import { ThemeProvider } from "next-themes";
import PerformanceMonitor from "./components/PerformanceMonitor";
import ErrorBoundary from "./components/ErrorBoundary";

// 静态元数据
export const metadata: Metadata = {
  title: {
    default: "Get Jobs - 自动化简历投递系统",
    template: "%s | Get Jobs"
  },
  description: "智能化的招聘网站自动化简历投递管理系统，支持Boss直聘、猎聘、智联招聘、前程无忧等主流招聘平台",
  keywords: ["简历投递", "招聘自动化", "Boss直聘", "猎聘", "智联招聘", "前程无忧", "求职工具"],
  authors: [{ name: "Get Jobs Team" }],
  creator: "Get Jobs",
  publisher: "Get Jobs",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('http://localhost:6866'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: '/',
    title: 'Get Jobs - 自动化简历投递系统',
    description: '智能化的招聘网站自动化简历投递管理系统',
    siteName: 'Get Jobs',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Get Jobs - 自动化简历投递系统',
    description: '智能化的招聘网站自动化简历投递管理系统',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// Viewport配置
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🍀</text></svg>"
          type="image/svg+xml"
        />
        {/* 预连接到常用域名 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* DNS预解析 */}
        <link rel="dns-prefetch" href="//localhost" />
      </head>
      <body suppressHydrationWarning className="dark:bg-blacksection antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          <ErrorBoundary>
            <PerformanceMonitor />
            <div className="flex min-h-screen">
              <Sidebar />
              <ContentArea>
                {children}
              </ContentArea>
            </div>
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}
