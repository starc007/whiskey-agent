import { Message } from "ai";

export interface BobMessage extends Message {
  analysis?: {
    flavor_profile?: string[];
    region?: string;
    price_range?: string;
  };
}

export interface ChatContextType {
  messages: BobMessage[];
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>, options?: any) => void;
  isLoading: boolean;
}
