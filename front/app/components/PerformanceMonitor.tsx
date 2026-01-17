"use client";

import { useEffect } from 'react';

// 性能监控组件
export default function PerformanceMonitor() {
  useEffect(() => {
    // 仅在客户端执行
    if (typeof window === 'undefined') return;

    // 监听页面加载性能
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        // 记录LCP (Largest Contentful Paint)
        if (entry.entryType === 'largest-contentful-paint') {
          console.log('LCP:', entry.startTime);
        }
        // 记录FID (First Input Delay)
        if (entry.entryType === 'first-input') {
          console.log('FID:', (entry as any).processingStart - entry.startTime);
        }
        // 记录CLS (Cumulative Layout Shift)
        if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
          console.log('CLS:', (entry as any).value);
        }
      }
    });

    // 观察性能指标
    try {
      observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
    } catch (e) {
      console.warn('Performance monitoring not fully supported');
    }

    // 监听页面可见性变化
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log('Page hidden');
      } else {
        console.log('Page visible');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 清理函数
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return null; // 这个组件不渲染任何内容
}