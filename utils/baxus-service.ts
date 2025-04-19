import { BaxusBarItem, AnalyzedCollection } from "@/types/types";

export class BaxusService {
  static async getUserBar(username: string): Promise<{
    success: boolean;
    data: {
      userBar: BaxusBarItem[];
      analysis: AnalyzedCollection;
    };
  }> {
    try {
      const response = await fetch("/api/bar");

      if (!response.ok) {
        throw new Error(`Failed to fetch bar data: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching bar data:", error);
      throw error;
    }
  }

  static analyzeCollection(barItems: BaxusBarItem[]): AnalyzedCollection {
    const spirits = new Map<string, number>();
    const prices: number[] = [];
    const proofs: number[] = [];
    let totalValue = 0;
    let totalBottles = barItems.length;

    barItems.forEach((item) => {
      const product = item.product;

      // Spirit type analysis
      spirits.set(product.spirit, (spirits.get(product.spirit) || 0) + 1);

      // Price analysis
      if (product.average_msrp) {
        prices.push(product.average_msrp);
        totalValue += product.average_msrp;
      }

      // Proof analysis
      if (product.proof) {
        proofs.push(product.proof);
      }
    });

    return {
      favoriteSpirits: Array.from(spirits.entries())
        .map(([spirit, count]) => ({
          spirit,
          count,
          percentage: (count / totalBottles) * 100,
        }))
        .sort((a, b) => b.count - a.count),

      priceRange: {
        min: Math.min(...prices),
        max: Math.max(...prices),
        average: totalValue / prices.length,
        median: this.calculateMedian(prices),
      },

      proofPreferences: {
        average: proofs.reduce((a, b) => a + b, 0) / proofs.length,
        median: this.calculateMedian(proofs),
        range: {
          min: Math.min(...proofs),
          max: Math.max(...proofs),
        },
      },

      collectionStats: {
        totalBottles,
        totalValue,
        averageBottleValue: totalValue / totalBottles,
        uniqueSpiritTypes: spirits.size,
      },
    };
  }

  private static calculateMedian(numbers: number[]): number {
    const sorted = numbers.sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);

    if (sorted.length % 2 === 0) {
      return (sorted[middle - 1] + sorted[middle]) / 2;
    }

    return sorted[middle];
  }
}
