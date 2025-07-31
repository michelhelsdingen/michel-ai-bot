'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Lottie from 'lottie-react';

interface MichelLottieHeadProps {
  state: 'idle' | 'talking' | 'thinking';
  size?: number;
}

export default function MichelLottieHead({ state, size = 200 }: MichelLottieHeadProps) {
  const [animationData, setAnimationData] = useState(null);
  const lottieRef = useRef(null);
  const [currentImage, setCurrentImage] = useState('/michel-gesloten.png');
  const [isAnimating, setIsAnimating] = useState(false);

  // Fallback to image switching with enhanced animations
  useEffect(() => {
    if (state === 'talking') {
      setIsAnimating(true);
      const interval = setInterval(() => {
        setCurrentImage(prev => 
          prev === '/michel-gesloten.png' ? '/michel-open.png' : '/michel-gesloten.png'
        );
      }, 200);

      return () => {
        clearInterval(interval);
        setIsAnimating(false);
        setCurrentImage('/michel-gesloten.png');
      };
    } else {
      setIsAnimating(false);
      setCurrentImage('/michel-gesloten.png');
    }
  }, [state]);

  // Load Lottie animation (optional enhancement)
  useEffect(() => {
    fetch('/michel-talking-animation.json')
      .then(response => response.json())
      .then(data => setAnimationData(data))
      .catch(() => {
        // Fallback to image animations if Lottie fails
        console.log('Using image fallback for Michel head animation');
      });
  }, []);

  const getContainerClasses = () => {
    const baseClasses = "relative transition-all duration-300 ease-out";
    
    switch (state) {
      case 'talking':
        return `${baseClasses} animate-pulse`;
      case 'thinking':
        return `${baseClasses} animate-bounce`;
      default:
        return `${baseClasses} animate-float`;
    }
  };

  const getGlowEffect = () => {
    switch (state) {
      case 'talking':
        return 'from-green-300 to-blue-400 animate-pulse';
      case 'thinking':
        return 'from-purple-300 to-pink-400 animate-spin';
      default:
        return 'from-yellow-300 to-orange-400';
    }
  };

  const getImageEffects = () => {
    const baseEffects = "relative z-10 drop-shadow-2xl transition-all duration-200";
    
    switch (state) {
      case 'talking':
        return `${baseEffects} transform hover:scale-110 ${isAnimating ? 'animate-bounce' : ''}`;
      case 'thinking':
        return `${baseEffects} transform hover:scale-105 animate-pulse`;
      default:
        return `${baseEffects} transform hover:scale-105`;
    }
  };

  return (
    <div className={getContainerClasses()}>
      {/* Dynamic Glow Effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${getGlowEffect()} rounded-full blur-2xl opacity-60 scale-110`}></div>
      
      {/* Multiple Glow Layers for Talking State */}
      {state === 'talking' && (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full blur-xl opacity-40 scale-125 animate-ping"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-cyan-500 rounded-full blur-lg opacity-30 scale-120 animate-pulse"></div>
        </>
      )}

      {/* Enhanced Thinking Effect */}
      {state === 'thinking' && (
        <div className="absolute -top-8 -right-8 flex space-x-1">
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-4 h-4 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      )}

      {/* Main Image Container */}
      <div className="relative z-10 flex items-center justify-center" style={{ width: size, height: size }}>
        {/* Try Lottie first, fallback to images */}
        {animationData && state === 'talking' ? (
          <Lottie
            ref={lottieRef}
            animationData={animationData}
            loop={true}
            autoplay={true}
            style={{ width: size, height: size }}
          />
        ) : (
          <Image
            src={currentImage}
            alt="Michel AI Bot"
            width={size}
            height={size}
            priority
            className={getImageEffects()}
            style={{ 
              maxWidth: `${size}px`, 
              maxHeight: `${size}px`,
              objectFit: 'contain'
            }}
          />
        )}
      </div>

      {/* Floating Particles for Talking */}
      {state === 'talking' && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full opacity-70 animate-ping"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
                animationDelay: `${i * 200}ms`,
                animationDuration: '1s'
              }}
            />
          ))}
        </div>
      )}

      {/* Sound Wave Effect for Talking */}
      {state === 'talking' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="absolute border-2 border-white/30 rounded-full animate-ping"
              style={{
                width: `${(i + 1) * 60}px`,
                height: `${(i + 1) * 60}px`,
                animationDelay: `${i * 300}ms`,
                animationDuration: '2s'
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}