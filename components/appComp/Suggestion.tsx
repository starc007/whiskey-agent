import React from "react";

const suggestions = [
  {
    title: "Analyze My Collection",
    description: "Show me insights about my whisky collection's profile",
  },
  {
    title: "Similar Recommendations",
    description: "Find whiskies similar to my favorites",
  },
  {
    title: "Expand Collection",
    description: "Suggest bottles to diversify my collection",
  },
  {
    title: "Price Range",
    description: "Find recommendations within my budget",
  },
  {
    title: "Regional Exploration",
    description: "Discover whiskies from specific regions",
  },
  {
    title: "Flavor Profile",
    description: "Find whiskies with specific taste notes",
  },
];

interface SuggestionProps {
  onSuggestionClick?: (suggestion: string) => void;
}

const Suggestion = ({ onSuggestionClick }: SuggestionProps) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-3xl">
        <h3 className="text-lg font-medium text-center mb-6">
          Here are some ways I can help you with your whisky collection
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              className="flex flex-col gap-2 p-4 rounded-2xl border border-primary/5 
                hover:bg-primary/5 transition-colors duration-200 text-left"
              onClick={() => onSuggestionClick?.(suggestion.title)}
            >
              <h4 className="font-medium text-primary/80">
                {suggestion.title}
              </h4>
              <p className="text-sm text-primary/40">
                {suggestion.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Suggestion;
