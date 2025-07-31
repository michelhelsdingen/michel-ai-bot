'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'michel';
}

export default function MichelAIBot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-white mb-2 drop-shadow-2xl">
            Michel AI Bot
          </h1>
          <p className="text-xl text-blue-100 drop-shadow-lg">
            De grappigste AI assistent van Nederland! 🎉
          </p>
        </div>

        {/* Chat Container */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 mb-6 h-96 overflow-y-auto border border-white/20">
          {messages.length === 0 && (
            <div className="text-center text-gray-700 mt-20">
              <p className="text-2xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                Hoi! Ik ben Michel AI Bot! 🤖
              </p>
              <p className="text-lg text-gray-600">Stel me een vraag en ik geef je een hilarisch antwoord!</p>
            </div>
          )}
          
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-4 ${
                message.sender === 'user' ? 'text-right' : 'text-left'
              }`}
            >
              <div
                className={`inline-block p-4 rounded-2xl max-w-[70%] shadow-lg ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                    : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300'
                }`}
              >
                <p className={`text-base ${message.sender === 'user' ? 'font-medium' : 'font-normal'}`}>
                  {message.text}
                </p>
              </div>
            </div>
          ))}
          
          {isThinking && (
            <div className="text-left mb-4">
              <div className="inline-block p-4 rounded-2xl bg-gradient-to-r from-gray-100 to-gray-200 shadow-lg">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full animate-bounce"></div>
                  <div className="w-3 h-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-3 h-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Vraag Michel iets grappigs..."
            className="flex-1 p-4 bg-white/90 backdrop-blur-md border-2 border-white/20 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/50 focus:border-purple-400 transition-all shadow-lg text-gray-800 placeholder-gray-500"
            disabled={isThinking}
          />
          <button
            type="submit"
            disabled={isThinking || !input.trim()}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 transition-all font-bold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:hover:scale-100"
          >
            {isThinking ? '🤔' : '✨ Verstuur'}
          </button>
        </form>
      </div>
    </div>
  );
}