"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { DotPattern } from "@/components/magicui/dot-pattern";

// Define message type to fix TypeScript errors
interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AIInteractiveBot() {
  // Define proper types for state variables
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom of messages when new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Define proper type for the form event
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message to the conversation
    const userMessage: Message = { role: "user", content: inputValue };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Call your API here
      // This is a placeholder for your actual API call
      const response = await fetch(`http://192.168.127.87:8000/ask-therapist/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_input: inputValue,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();

      // Add AI response to the conversation
      setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
    } catch (error) {
      console.error("Error:", error);
      // Add error message to conversation
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I encountered an error. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden rounded-lg border bg-blue-50">
      {/* Background pattern with pastel blue */}
      <DotPattern
        className={cn(
          "absolute inset-0 [mask-image:radial-gradient(600px_circle_at_center,white,transparent)]",
        )}
        color="rgba(191, 219, 254, 0.6)" // Pastel blue color
        size={24}
      />

      {/* Header with pastel indigo */}
      <div className="relative z-10 text-center p-8 mt-10 border-b border-indigo-100">
        <h1 className="text-3xl font-bold text-indigo-600">Share what's bothering you!</h1>
        <p className="text-indigo-400 mt-4 text-lg">
          Talk through your problems with an AI that listens
        </p>
      </div>

      {/* Chat container */}
      <div className="flex flex-col flex-1 overflow-hidden relative z-10">
        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-6">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-indigo-300 text-lg">
              Start a conversation...
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex max-w-[80%] p-4 rounded-lg shadow-sm",
                    message.role === "user"
                      ? "ml-auto bg-indigo-100 text-indigo-800" // Pastel indigo for user messages
                      : "mr-auto bg-green-100 text-green-800" // Pastel matcha green for assistant messages
                  )}
                >
                  {message.content}
                </div>
              ))}
              {isLoading && (
                <div className="mr-auto max-w-[80%] p-4 rounded-lg bg-green-100 flex items-center space-x-2 shadow-sm">
                  <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input area with pastel colors */}
        <form onSubmit={handleSubmit} className="p-6 border-t border-indigo-100 bg-blue-50/80 backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message here..."
              className="flex-1 py-3 px-6 rounded-full border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 text-base text-indigo-700 placeholder:text-indigo-300"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="p-3 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors"
              disabled={isLoading || !inputValue.trim()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
