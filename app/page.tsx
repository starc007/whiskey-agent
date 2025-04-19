"use client";
import ChatInput from "@/components/appComp/ChatInput";
import ChatMessages from "@/components/appComp/ChatMessages";
import Suggestion from "@/components/appComp/Suggestion";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { RecommendationEngine } from "@/utils/recommendation-engine";
import { AnalyzedCollection, ProductMatch } from "@/types/types";
import { BOB_CONTEXT } from "@/utils/ai-config";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmbeddingService } from "@/utils/embedding-service";

const USERNAME = "carriebaxus";

const getAnalysisContext = (
  analysis: AnalyzedCollection,
  username: string = USERNAME
) => {
  return `# Current Collection Analysis for @${username}
- Total Bottles: ${analysis.collectionStats.totalBottles}
- Favorite Spirits: ${analysis.favoriteSpirits
    .map((s) => `${s.spirit} (${s.count} bottles, ${s.percentage.toFixed(1)}%)`)
    .join(", ")}
- Price Range: $${analysis.priceRange.min} - $${
    analysis.priceRange.max
  } (avg: $${analysis.collectionStats.averageBottleValue.toFixed(2)})
- Proof Preferences: ${analysis.proofPreferences.range.min}° - ${
    analysis.proofPreferences.range.max
  }° (avg: ${analysis.proofPreferences.average.toFixed(1)}°)
- Collection Value: $${analysis.collectionStats.totalValue.toFixed(2)}
- Unique Spirit Types: ${analysis.collectionStats.uniqueSpiritTypes}`;
};

const getRecommendationsContext = (recommendations: ProductMatch[]) => {
  return recommendations
    .map(
      (rec: ProductMatch) => `## ${rec.datasetProduct.name}
- Spirit Type: ${rec.datasetProduct.spirit_type}
- Proof: ${rec.datasetProduct.proof}°
- Price: $${rec.datasetProduct.avg_msrp}
- Match Score: ${(rec.score * 100).toFixed(1)}%
- Reasons:
${rec.reasons.map((r: string) => `  • ${r}`).join("\n")}`
    )
    .join("\n\n");
};

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
  const [username, setUsername] = useState<string>("");
  const [analysis, setAnalysis] = useState<AnalyzedCollection | null>(null);
  const [recommendations, setRecommendations] = useState<ProductMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInputExpanded, setIsInputExpanded] = React.useState(false);

  const fetchUserData = async (username: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/api/bar?username=${encodeURIComponent(username)}`
      );
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to fetch user data");
      }

      const bottleRecommendations =
        await RecommendationEngine.getRecommendations(data.data.userBar);
      setAnalysis(data.data.analysis);
      setRecommendations(bottleRecommendations);
      setUsername(username);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (message: string) => {
    try {
      setIsInputExpanded(true);
      setInput("");

      // Check if message contains a username lookup request
      const usernameMatch = message.match(
        /^(?:find|lookup|search|get|show) (?:details|info|data|collection) (?:for|of) @?(\w+)$/i
      );

      if (usernameMatch) {
        const newUsername = usernameMatch[1];
        const data = await fetchUserData(newUsername);
        const analysis = data?.data.analysis;
        const recommendations = data?.data.userBar;

        if (!analysis || !recommendations) {
          throw new Error("Failed to fetch user data");
        }
        const bottleRecommendations =
          await RecommendationEngine.getRecommendations(recommendations);
        const analysisContext = getAnalysisContext(analysis!);
        const recommendationsContext = getRecommendationsContext(
          bottleRecommendations
        );
        setMessages([
          ...messages,
          {
            content: message,
            role: "user",
            id: Date.now().toString(),
          },
        ]);
        await append(
          {
            content: getAnalysisContext(analysis!, newUsername),
            role: "assistant",
            id: Date.now().toString(),
          },
          {
            data: {
              context: `${analysisContext}\n\n# Current Recommendations\n${recommendationsContext}`,
            },
          }
        );
        return;
      }

      // Structure the analysis context
      const analysisContext = getAnalysisContext(analysis!);

      // Convert recommendations to a formatted string
      const recommendationsContext = getRecommendationsContext(recommendations);

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

  useEffect(() => {
    // Load initial data for a default user if needed
    fetchUserData(USERNAME);
  }, []);

  return (
    <main className="h-full flex flex-col overflow-hidden">
      {/* Loading Spinner */}
      {loading && !EmbeddingService.isInitialized && <LoadingSpinner />}

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
              Ask me about whisky recommendations or lookup a collection using
              "@username"
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Show current username if one is selected */}
      {username && (
        <div className="text-sm text-gray-500 text-center mb-2">
          Viewing collection for @{username}
        </div>
      )}

      {/* Show error if any */}
      {error && (
        <div className="text-center text-red-500 mb-2 p-4 bg-red-50 rounded">
          {error}
        </div>
      )}

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
        className="w-full ml-5"
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
