"use client";
import ChatInput from "@/components/appComp/ChatInput";
import ChatMessages from "@/components/appComp/ChatMessages";
import Suggestion from "@/components/appComp/Suggestion";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const HomePage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isInputExpanded, setIsInputExpanded] = useState(false);

  const handleSendMessage = (message: string) => {
    if (!message.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: message,
      },
    ]);
    setIsInputExpanded(true);
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  return (
    <main className="h-full flex flex-col overflow-hidden">
      <AnimatePresence>
        {!isInputExpanded && (
          <motion.div
            className="text-center py-8"
            initial={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-3xl font-bold">
              Bob - Your Personal Whisky Expert
            </h1>
            <p className="text-gray-600 mt-2">
              Ask me about whisky recommendations for your collection
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Messages or Suggestions */}
      <motion.div
        className="flex-1 relative"
        animate={{
          marginTop: isInputExpanded ? "1rem" : "0",
        }}
      >
        {messages.length > 0 ? (
          <ChatMessages messages={messages} />
        ) : (
          <Suggestion onSuggestionClick={handleSuggestionClick} />
        )}
      </motion.div>

      {/* Chat Input */}
      <motion.div
        className="p-4 w-full"
        initial={false}
        animate={{
          y: isInputExpanded ? "0%" : "-60%",
          scale: isInputExpanded ? 0.9 : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <ChatInput onSendMessage={handleSendMessage} />
      </motion.div>
    </main>
  );
};

export default HomePage;
