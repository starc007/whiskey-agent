import React from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatMessagesProps {
  messages: Message[];
}

const ChatMessages = ({ messages }: ChatMessagesProps) => {
  if (messages.length === 0) {
    return null;
  }

  return (
    <div className="flex-1 overflow-hidden px-4">
      <div className="h-full max-w-5xl mx-auto relative">
        <div className="absolute inset-0 overflow-y-auto p-4 space-y-4 rounded-lg border border-primary/10">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-lg ${
                  message.role === "user"
                    ? "bg-primary/10 text-primary"
                    : "bg-secondary/10 text-secondary"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatMessages;
