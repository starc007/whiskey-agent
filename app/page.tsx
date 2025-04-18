"use client";
import ChatInput from "@/components/appComp/ChatInput";
import ChatMessages from "@/components/appComp/ChatMessages";
import Suggestion from "@/components/appComp/Suggestion";
import React, { useState } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const HomePage = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSendMessage = (message: string) => {
    if (!message.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: message,
      },
    ]);
    // TODO: Here we'll add the logic to communicate with Bob AI
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  return (
    <main className="h-full flex flex-col overflow-hidden">
      {/* Header - fixed height */}
      <div className="text-center py-8">
        <h1 className="text-3xl font-bold">
          Bob - Your Personal Whisky Expert
        </h1>
        <p className="text-gray-600 mt-2">
          Ask me about whisky recommendations for your collection
        </p>
      </div>

      {/* Chat Messages or Suggestions */}
      {messages.length > 0 ? (
        <ChatMessages messages={messages} />
      ) : (
        <Suggestion onSuggestionClick={handleSuggestionClick} />
      )}

      {/* Chat Input - fixed height */}
      <div className="p-4">
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </main>
  );
};

export default HomePage;
