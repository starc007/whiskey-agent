import React from "react";
import { Button } from "../ui/Button";
import { ArrowUp } from "@phosphor-icons/react";
import { motion } from "framer-motion";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const ChatInput = ({ onSendMessage, value, onChange }: ChatInputProps) => {
  const handleSubmit = () => {
    if (value.trim()) {
      onSendMessage(value);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <motion.div
      className="w-full max-w-3xl mx-auto rounded-3xl relative"
      whileTap={{ scale: 0.98 }}
    >
      <textarea
        className="w-full p-4 focus:outline-none rounded-3xl resize-none border border-primary/5"
        placeholder="Ask Bob about whisky recommendations..."
        rows={3}
        value={value}
        onChange={onChange}
        onKeyPress={handleKeyPress}
      />
      <Button
        variant="outline"
        size="icon"
        className="absolute right-4 bottom-4 rounded-full hover:bg-primary/5 border border-primary/10"
        onClick={handleSubmit}
        disabled={!value.trim()}
      >
        <ArrowUp size={20} className="hover:rotate-45 duration-300" />
      </Button>
    </motion.div>
  );
};

export default ChatInput;
