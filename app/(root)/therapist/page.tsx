"use client";

import React, { useState, useRef, useEffect, useCallback, memo } from "react";
import { cn } from "@/lib/utils";
import { DotPattern } from "@/components/magicui/dot-pattern";

// Define message type to fix TypeScript errors
interface Message {
  role: 'user' | 'assistant';
  content: string;
  id: string; // Added unique ID for better list rendering
}

// Memoized message component to prevent unnecessary re-renders
const MessageItem = memo(({ message }: { message: Message }) => (
  <div
    className={cn(
      "flex max-w-[80%] p-4 rounded-lg shadow-sm",
      message.role === "user"
        ? "ml-auto bg-indigo-100 text-indigo-800"
        : "mr-auto bg-green-100 text-green-800"
    )}
  >
    {message.content}
  </div>
));

// Memoized loading indicator
const LoadingIndicator = memo(() => (
  <div className="mr-auto max-w-[80%] p-4 rounded-lg bg-green-100 flex items-center space-x-2 shadow-sm">
    <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
    <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
    <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
  </div>
));

// Memoized message list component
const MessageList = memo(({ messages, isLoading }: { messages: Message[]; isLoading: boolean }) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-indigo-300 text-lg">
        Start a conversation...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}
      {isLoading && <LoadingIndicator />}
      <div ref={messagesEndRef} />
    </div>
  );
});

// Debounce function implementation
const debounce = <F extends (...args: any[]) => any>(
  func: F,
  waitFor: number
) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  const debounced = (...args: Parameters<F>) => {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), waitFor);
  };

  return debounced;
};

export default function AIInteractiveBot() {
  // Define proper types for state variables
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [displayValue, setDisplayValue] = useState<string>(""); // Display value for immediate feedback
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Debounced input handler
  const debouncedSetInput = useCallback(
    debounce((value: string) => {
      setInputValue(value);
    }, 100),
    []
  );

  // Handle input changes with immediate visual feedback
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDisplayValue(value); // Update display immediately for responsive feeling
    debouncedSetInput(value); // Debounce the actual state update
  }, [debouncedSetInput]);

  // Memoized submit handler
  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Cancel any in-flight requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Add user message to the conversation
    const userMessage: Message = {
      role: "user",
      content: inputValue,
      id: Date.now().toString() // Simple unique ID
    };

    setMessages((prev) => [...prev, userMessage]);
    setDisplayValue("");
    setInputValue("");
    setIsLoading(true);

    // Create new abort controller for this request
    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Set a timeout to abort long-running requests
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      // Call your API here with timeout handling
      const response = await fetch(`https://milo-ynas.onrender.com/ask-therapist/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_input: inputValue,
        }),
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();

      // Add AI response to the conversation
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.response,
          id: Date.now().toString()
        }
      ]);
    } catch (error) {
      // Only add error message if the request wasn't aborted
      if ((error as Error).name !== 'AbortError') {
        console.error("Error:", error);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Sorry, I encountered an error. Please try again.",
            id: Date.now().toString()
          },
        ]);
      }
    } finally {
      clearTimeout(timeoutId);
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
        setIsLoading(false);
      }
    }
  }, [inputValue]);

  // Reduce background pattern complexity when typing/loading
  const showFullBackground = !isLoading && !inputValue;

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden rounded-lg border bg-blue-50">
      {/* Background pattern with reduced opacity when typing */}
      <DotPattern
        className={cn(
          "absolute inset-0 transition-opacity duration-300",
          "[mask-image:radial-gradient(600px_circle_at_center,white,transparent)]",
          showFullBackground ? "opacity-100" : "opacity-30"
        )}
        color="rgba(191, 219, 254, 0.6)"
        size={showFullBackground ? 24 : 48} // Increase size when typing to reduce complexity
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
          <MessageList messages={messages} isLoading={isLoading} />
        </div>

        {/* Input area with pastel colors */}
        <form onSubmit={handleSubmit} className="p-6 border-t border-indigo-100 bg-blue-50/80 backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={displayValue}
              onChange={handleInputChange}
              placeholder="Type your message here..."
              className="flex-1 py-3 px-6 rounded-full border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 text-base text-indigo-700 placeholder:text-indigo-300"
              disabled={isLoading}
            />
            <button
              type="submit"
              className={cn(
                "p-3 rounded-full text-white transition-colors",
                (isLoading || !inputValue.trim())
                  ? "bg-green-300 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600"
              )}
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
