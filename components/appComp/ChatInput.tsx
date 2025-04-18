import React, { useState } from "react";
import { Button } from "../ui/Button";
import { ArrowUp } from "@phosphor-icons/react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

const ChatInput = ({ onSendMessage }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    onSendMessage(message);
    setMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="relative">
        <textarea
          className="w-full p-4 focus:outline-none border border-primary/10 rounded-3xl resize-none"
          placeholder="Ask Bob about whisky recommendations..."
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <Button
          variant="outline"
          size="icon"
          className="absolute right-4 bottom-4 border-primary/10 rounded-full hover:bg-primary/10"
          onClick={handleSubmit}
          disabled={!message.trim()}
        >
          <ArrowUp size={20} className="hover:rotate-45 duration-300" />
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
