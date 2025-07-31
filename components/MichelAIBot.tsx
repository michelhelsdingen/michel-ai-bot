'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import AnimatedBackground from './AnimatedBackground';
import ThinkingAnimation from './ThinkingAnimation';
import AnimatedMessage from './AnimatedMessage';
import SparkleEffect from './SparkleEffect';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Send, Sparkles, Bot } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'michel';
}

export default function MichelAIBot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isTalking, setIsTalking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const animateTalking = (duration: number) => {
    const words = duration / 150; // Ongeveer 150ms per "woord"
    let toggleCount = 0;
    
    const interval = setInterval(() => {
      setIsTalking(prev => !prev);
      toggleCount++;
      
      if (toggleCount >= words * 2) {
        clearInterval(interval);
        setIsTalking(false);
      }
    }, 150);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsThinking(true);

    try {
      const response = await fetch('/api/michel-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      
      setIsThinking(false);
      
      // Start met praten animatie
      const responseLength = data.response.length;
      animateTalking(responseLength * 20); // 20ms per karakter
      
      const michelMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        sender: 'michel'
      };

      setMessages(prev => [...prev, michelMessage]);
    } catch (error) {
      setIsThinking(false);
      console.error('Error:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Oeps! Michel heeft even een black-out. Probeer het nog eens!',
        sender: 'michel'
      };
      
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 p-4 relative overflow-hidden">
      <AnimatedBackground />
      <div className="w-full max-w-6xl relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Bot className="w-12 h-12 text-yellow-300 animate-pulse" />
            <h1 className="text-7xl font-bold text-white drop-shadow-2xl bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
              HelsBotje GPT
            </h1>
            <Sparkles className="w-12 h-12 text-pink-300 animate-bounce" />
          </div>
          <Badge variant="magic" className="text-lg px-6 py-2 mb-4">
            🇳🇱 De grappigste AI assistent van Nederland! 
          </Badge>
          <p className="text-xl text-blue-100/80 drop-shadow-lg max-w-2xl mx-auto">
            Powered by Michel&apos;s humor &amp; OpenAI&apos;s intelligence ✨
          </p>
        </div>

        {/* Michel's Hoofd */}
        <div className="flex justify-center mb-6">
          <div className="relative animate-float">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full blur-2xl opacity-50 scale-110"></div>
            <div className="relative z-10 w-[200px] h-[200px] flex items-center justify-center">
              <Image
                src={isTalking ? '/michel-open.png' : '/michel-gesloten.png'}
                alt="Michel AI Bot"
                width={200}
                height={200}
                priority
                className="drop-shadow-2xl transition-all duration-150 hover:scale-105 transform object-contain"
                style={{ maxWidth: '200px', maxHeight: '200px' }}
              />
            </div>
            <SparkleEffect active={isTalking} />
            {isThinking && (
              <div className="absolute -top-2 -right-2">
                <div className="relative">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-yellow-300"></div>
                  <div className="absolute inset-0 animate-ping rounded-full h-10 w-10 border-4 border-yellow-300 opacity-25"></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Chat Container */}
        <Card className="mb-6 h-[500px] shadow-2xl border-2 border-white/30 bg-white/5 backdrop-blur-xl">
          <CardContent className="p-6 h-full overflow-y-auto">
            {messages.length === 0 && (
              <div className="text-center mt-32 space-y-4">
                <div className="text-6xl mb-4">🤖</div>
                <h2 className="text-3xl font-bold mb-3 text-white">
                  Hoi! Ik ben HelsBotje GPT!
                </h2>
                <p className="text-xl text-blue-100/80 max-w-md mx-auto leading-relaxed">
                  Stel me een vraag en ik geef je een hilarisch antwoord vol Nederlandse humor! 
                </p>
                <div className="flex items-center justify-center gap-2 mt-6">
                  <Badge variant="magic">Powered by OpenAI</Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white">Dutch Humor</Badge>
                </div>
              </div>
            )}
          
          {messages.map((message, index) => (
            <AnimatedMessage
              key={message.id}
              sender={message.sender}
              delay={index * 100}
            >
              {message.text}
            </AnimatedMessage>
          ))}
          
          {isThinking && (
            <div className="text-left mb-4 animate-fade-in">
              <div className="inline-block p-4 rounded-2xl bg-gradient-to-r from-gray-100 to-gray-200 shadow-lg">
                <ThinkingAnimation size={32} />
              </div>
            </div>
          )}
          
            <div ref={messagesEndRef} />
          </CardContent>
        </Card>

        {/* Input Form */}
        <Card className="border-2 border-white/30 bg-white/5 backdrop-blur-xl shadow-2xl">
          <CardContent className="p-4">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <div className="flex-1 relative">
                <Input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Vraag HelsBotje iets grappigs... 🇳🇱"
                  disabled={isThinking}
                  className="pr-12 h-12 text-lg border-2 border-white/40 bg-white/10 placeholder:text-white/60 text-white focus:border-pink-400 focus:ring-pink-400/50"
                />
                <Bot className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
              </div>
              <Button
                type="submit"
                disabled={isThinking || !input.trim()}
                variant="magic"
                size="lg"
                className="h-12 px-6 text-lg font-bold"
              >
                {isThinking ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Denkt...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Verstuur
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}