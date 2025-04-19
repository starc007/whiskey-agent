import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { BaxusService } from "./baxus-service";
import { RecommendationEngine } from "./recommendation-engine";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function analyzeUserBarAndGetRecommendations(
  username: string,
  recommendationLimit: number = 5
) {
  try {
    // Fetch user's bar
    const userBar = await BaxusService.getUserBar(username);

    // Analyze the collection
    const analysis = BaxusService.analyzeCollection(userBar);

    // Get recommendations
    const recommendations = await RecommendationEngine.getRecommendations(
      userBar,
      recommendationLimit
    );

    return {
      analysis,
      recommendations,
      userBar,
    };
  } catch (error) {
    console.error("Error analyzing bar and getting recommendations:", error);
    throw error;
  }
}
