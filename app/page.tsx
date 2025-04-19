"use client";
import ChatInput from "@/components/appComp/ChatInput";
import ChatMessages from "@/components/appComp/ChatMessages";
import Suggestion from "@/components/appComp/Suggestion";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { BaxusService } from "@/utils/baxus-service";
import { RecommendationEngine } from "@/utils/recommendation-engine";
import { AnalyzedCollection, ProductMatch } from "@/types/types";
import { BOB_CONTEXT } from "@/utils/ai-config";

const USERNAME = "carriebaxus";

const HomePage = () => {
  const { messages, input, setInput, append, setMessages } = useChat({
    initialMessages: [
      {
        role: "system",
        content: BOB_CONTEXT,
        id: "system-1",
      },
    ],
  });
  const [username, setUsername] = useState("carriebaxus");
  const [analysis, setAnalysis] = useState<AnalyzedCollection | null>(null);
  const [recommendations, setRecommendations] = useState<ProductMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isInputExpanded, setIsInputExpanded] = React.useState(false);

  const handleSendMessage = async (message: string) => {
    try {
      setIsInputExpanded(true);
      setInput("");

      // Structure the analysis context
      const analysisContext = analysis
        ? `# Current Collection Analysis
- Total Bottles: ${analysis.collectionStats.totalBottles}
- Favorite Spirits: ${analysis.favoriteSpirits
            .map(
              (s) =>
                `${s.spirit} (${s.count} bottles, ${s.percentage.toFixed(1)}%)`
            )
            .join(", ")}
- Price Range: $${analysis.priceRange.min} - $${
            analysis.priceRange.max
          } (avg: $${analysis.collectionStats.averageBottleValue.toFixed(2)})
- Proof Preferences: ${analysis.proofPreferences.range.min}° - ${
            analysis.proofPreferences.range.max
          }° (avg: ${analysis.proofPreferences.average.toFixed(1)}°)
- Collection Value: $${analysis.collectionStats.totalValue.toFixed(2)}
- Unique Spirit Types: ${analysis.collectionStats.uniqueSpiritTypes}`
        : "";

      // Convert recommendations to a formatted string
      const recommendationsContext = recommendations
        .map(
          (rec) => `## ${rec.datasetProduct.name}
- Spirit Type: ${rec.datasetProduct.spirit_type}
- Proof: ${rec.datasetProduct.proof}°
- Price: $${rec.datasetProduct.avg_msrp}
- Match Score: ${(rec.score * 100).toFixed(1)}%
- Reasons:
${rec.reasons.map((r) => `  • ${r}`).join("\n")}`
        )
        .join("\n\n");

      // For the actual message content, just use the user's message
      await append(
        {
          content: message,
          role: "user",
          id: Date.now().toString(),
        },
        {
          data: {
            context: `${analysisContext}\n\n# Current Recommendations\n${recommendationsContext}`,
          },
        }
      );
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const userBar = await BaxusService.getUserBar(USERNAME);
      const bottleRecommendations =
        await RecommendationEngine.getRecommendations(userBar?.data?.userBar);
      console.log("bottleRecommendations", bottleRecommendations);
      setAnalysis(userBar?.data?.analysis);
      setRecommendations(bottleRecommendations);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
        {messages.length > 1 ? (
          <ChatMessages
            messages={messages.filter((m) => m.role !== "system")}
          />
        ) : (
          <Suggestion onSuggestionClick={handleSuggestionClick} />
        )}
      </motion.div>

      {/* Chat Input */}
      <motion.div
        className="w-full"
        initial={false}
        animate={{
          y: isInputExpanded ? "0%" : "-60%",
          scale: isInputExpanded ? 0.9 : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <ChatInput
          onSendMessage={handleSendMessage}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </motion.div>
    </main>
  );
};

export default HomePage;
