'use client';

import { useEffect, useRef } from 'react';

interface ThinkingAnimationProps {
  size?: number;
}

export default function ThinkingAnimation({ size = 40 }: ThinkingAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create animated dots
    const dots = [];
    for (let i = 0; i < 3; i++) {
      const dot = document.createElement('div');
      dot.className = 'thinking-dot';
      dot.style.cssText = `
        width: ${size * 0.3}px;
        height: ${size * 0.3}px;
        background: linear-gradient(45deg, #8B5CF6, #3B82F6);
        border-radius: 50%;
        margin: 0 ${size * 0.1}px;
        animation: thinkingBounce 1.4s ease-in-out infinite both;
        animation-delay: ${i * 0.16}s;
      `;
      dots.push(dot);
      container.appendChild(dot);
    }

    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes thinkingBounce {
        0%, 80%, 100% {
          transform: scale(0);
          opacity: 0.5;
        }
        40% {
          transform: scale(1);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      dots.forEach(dot => container.removeChild(dot));
      document.head.removeChild(style);
    };
  }, [size]);

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center"
      style={{ height: size, width: size * 2 }}
    />
  );
}