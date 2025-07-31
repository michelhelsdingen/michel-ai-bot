'use client';

import { useEffect, useRef } from 'react';

interface SparkleEffectProps {
  active: boolean;
}

export default function SparkleEffect({ active }: SparkleEffectProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active || !containerRef.current) return;

    const container = containerRef.current;
    const sparkles: HTMLDivElement[] = [];

    const createSparkle = () => {
      const sparkle = document.createElement('div');
      sparkle.innerHTML = '✨';
      sparkle.style.cssText = `
        position: absolute;
        font-size: ${Math.random() * 16 + 12}px;
        left: ${Math.random() * 200}px;
        top: ${Math.random() * 200}px;
        pointer-events: none;
        animation: sparkleFloat 2s ease-out forwards;
        z-index: 10;
      `;
      
      container.appendChild(sparkle);
      sparkles.push(sparkle);

      setTimeout(() => {
        if (container.contains(sparkle)) {
          container.removeChild(sparkle);
        }
        const index = sparkles.indexOf(sparkle);
        if (index > -1) sparkles.splice(index, 1);
      }, 2000);
    };

    // Create sparkles at intervals
    const interval = setInterval(createSparkle, 300);

    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes sparkleFloat {
        0% {
          opacity: 0;
          transform: translateY(0) scale(0);
        }
        20% {
          opacity: 1;
          transform: translateY(-10px) scale(1);
        }
        100% {
          opacity: 0;
          transform: translateY(-50px) scale(0.5);
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      clearInterval(interval);
      sparkles.forEach(sparkle => {
        if (container.contains(sparkle)) {
          container.removeChild(sparkle);
        }
      });
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, [active]);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 pointer-events-none"
      style={{ width: '200px', height: '200px' }}
    />
  );
}