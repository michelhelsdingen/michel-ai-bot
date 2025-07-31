'use client';

import { useEffect, useRef, useState } from 'react';

interface AnimatedMessageProps {
  children: React.ReactNode;
  sender: 'user' | 'michel';
  delay?: number;
}

export default function AnimatedMessage({ children, sender, delay = 0 }: AnimatedMessageProps) {
  const [isVisible, setIsVisible] = useState(false);
  const messageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const messageClasses = `
    transform transition-all duration-500 ease-out
    ${isVisible 
      ? 'translate-y-0 opacity-100 scale-100' 
      : sender === 'user' 
        ? 'translate-x-8 opacity-0 scale-95' 
        : 'translate-x-[-8px] opacity-0 scale-95'
    }
    ${sender === 'user' ? 'text-right' : 'text-left'}
  `;

  const bubbleClasses = `
    inline-block p-4 rounded-2xl max-w-[70%] shadow-lg transform transition-all hover:scale-105
    ${sender === 'user'
      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
      : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300'
    }
    ${isVisible ? 'animate-bounce-in' : ''}
  `;

  return (
    <div ref={messageRef} className={`mb-4 ${messageClasses}`}>
      <div className={bubbleClasses}>
        <p className={`text-base ${sender === 'user' ? 'font-medium' : 'font-normal'}`}>
          {children}
        </p>
      </div>
      <style jsx>{`
        @keyframes bounce-in {
          0% {
            transform: scale(0.8);
            opacity: 0;
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-bounce-in {
          animation: bounce-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}