"use client";

import { useState, useEffect } from 'react';
import { BiLoaderAlt } from 'react-icons/bi';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  fullScreen?: boolean;
}

export default function LoadingSpinner({
  size = 'md',
  message = '加载中...',
  fullScreen = false
}: LoadingSpinnerProps) {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const containerClasses = fullScreen
    ? 'fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm'
    : 'flex items-center justify-center p-4';

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center space-y-2">
        <BiLoaderAlt
          className={`${sizeClasses[size]} animate-spin text-primary`}
          aria-hidden="true"
        />
        {message && (
          <p className="text-sm text-muted-foreground animate-pulse">
            {message}{dots}
          </p>
        )}
      </div>
    </div>
  );
}

// 页面级加载组件
export function PageLoading() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[400px]">
      <LoadingSpinner size="lg" message="正在加载页面" />
    </div>
  );
}

// 内联加载组件
export function InlineLoading({ message = '处理中...' }: { message?: string }) {
  return (
    <div className="inline-flex items-center space-x-2">
      <BiLoaderAlt className="w-4 h-4 animate-spin text-primary" />
      <span className="text-sm text-muted-foreground">{message}</span>
    </div>
  );
}