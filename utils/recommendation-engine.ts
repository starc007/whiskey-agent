import {
  BaxusBarItem,
  DatasetProduct,
  ProductMatch,
  AnalyzedCollection,
} from "../types/types";
import { BaxusService } from "./baxus-service";
import { EmbeddingService } from "./embedding-service";

export class RecommendationEngine {
  private static dataset: DatasetProduct[] = [];

  static async loadDataset(): Promise<void> {
    try {
      // Fetch dataset from our API endpoint
      const response = await fetch("/api/dataset");
      if (!response.ok) {
        throw new Error("Failed to fetch dataset");
      }

      const { data: rawData } = await response.json();

      // Clean and transform the data
      this.dataset = rawData.map((row: any) => ({
        name: row.name,
        size: row.size,
        proof: Number(row.proof),
        abv: Number(row.abv),
        spirit_type: row.spirit_type,
        brand_id: Number(row.brand_id),
        popularity: Number(row.popularity),
        image_url: row.image_url,
        avg_msrp: Number(row.avg_msrp),
        fair_price: Number(row.fair_price),
        shelf_price: Number(row.shelf_price),
        total_score: Number(row.total_score),
        wishlist_count: Number(row.wishlist_count),
        vote_count: Number(row.vote_count),
        bar_count: Number(row.bar_count),
        ranking: Number(row.ranking),
      }));

      // Initialize embeddings
      await EmbeddingService.initialize(this.dataset);

      console.log(`Loaded ${this.dataset.length} products from dataset`);
    } catch (error) {
      console.error("Error loading dataset:", error);
      throw error;
    }
  }

  static calculateProductScore(
    product: DatasetProduct,
    userBar: BaxusBarItem[],
    userAnalysis: AnalyzedCollection
  ): ProductMatch {
    const reasons: string[] = [];
    let score = 0;

    // Price Match (15%)
    const priceMatch =
      1 -
      Math.abs(product.avg_msrp - userAnalysis.priceRange.average) /
        userAnalysis.priceRange.average;
    score += priceMatch * 0.15;
    if (priceMatch > 0.8) {
      reasons.push(
        `Price point ($${product.avg_msrp}) aligns with your collection average`
      );
    }

    // Spirit Type Match (15%)
    const spiritPreference = userAnalysis.favoriteSpirits.find(
      (s) => s.spirit === product.spirit_type
    );
    if (spiritPreference) {
      const spiritScore =
        spiritPreference.count / userAnalysis.collectionStats.totalBottles;
      score += spiritScore * 0.15;
      reasons.push(`Matches your preference for ${product.spirit_type}`);
    }

    // Popularity and Social Proof (10%)
    const popularityScore = Math.min(
      1,
      (product.bar_count / 1000 +
        product.wishlist_count / 500 +
        product.vote_count / 100) /
        3
    );
    score += popularityScore * 0.1;
    if (popularityScore > 0.7) {
      reasons.push(
        `Popular choice with ${product.bar_count} users having it in their bars`
      );
    }

    // Quality Score (10%)
    const normalizedTotalScore = product.total_score / 100;
    score += normalizedTotalScore * 0.1;
    if (normalizedTotalScore > 0.8) {
      reasons.push(`Highly rated with a score of ${product.total_score}/100`);
    }

    // Proof/ABV Match (10%)
    const proofMatch =
      1 - Math.abs(product.proof - userAnalysis.proofPreferences.average) / 100;
    score += proofMatch * 0.1;
    if (proofMatch > 0.9) {
      reasons.push(
        `Proof strength (${product.proof}°) matches your preferences`
      );
    }

    // Market Value (10%)
    const valueScore =
      product.fair_price > product.avg_msrp
        ? Math.min(
            1,
            (product.fair_price - product.avg_msrp) / product.avg_msrp
          )
        : 0;
    score += valueScore * 0.1;
    if (valueScore > 0.2) {
      reasons.push(
        `Good value: Fair price ($${product.fair_price}) exceeds MSRP ($${product.avg_msrp})`
      );
    }

    // Embedding Similarity (30% - increased from 20%)
    const userTopBottles = userBar
      .sort((a, b) => b.product.popularity - a.product.popularity)
      .slice(0, 5) // Consider top 5 bottles
      .map((item) => item.product);

    if (userTopBottles.length > 0) {
      let totalSimilarity = 0;
      let matchedBottles = 0;

      for (const topBottle of userTopBottles) {
        const similarProducts = EmbeddingService.findSimilarProducts(
          { name: topBottle.name } as DatasetProduct,
          [product],
          1,
          0.6 // Minimum similarity threshold
        );

        if (similarProducts.length > 0) {
          totalSimilarity += similarProducts[0].similarity;
          matchedBottles++;

          // Add specific similarity reasons for highly similar bottles
          if (similarProducts[0].similarity > 0.85) {
            reasons.push(
              `Very similar profile to ${topBottle.name} in your collection`
            );
          }
        }
      }

      if (matchedBottles > 0) {
        const embeddingScore = totalSimilarity / matchedBottles;
        score += embeddingScore * 0.3;

        if (matchedBottles >= 2) {
          reasons.push(
            `Matches the profile of ${matchedBottles} of your favorite bottles`
          );
        }
      }
    }

    return {
      datasetProduct: product,
      score,
      reasons,
    };
  }

  static async getRecommendations(
    userBar: BaxusBarItem[],
    limit: number = 5
  ): Promise<ProductMatch[]> {
    if (this.dataset.length === 0) {
      await this.loadDataset();
    }

    const userAnalysis = BaxusService.analyzeCollection(userBar);
    const existingProducts = new Set(
      userBar.map((item) => item.product.name.toLowerCase())
    );

    const recommendations: ProductMatch[] = [];

    for (const product of this.dataset) {
      // Skip if user already has this product
      if (existingProducts.has(product.name.toLowerCase())) continue;

      const match = this.calculateProductScore(product, userBar, userAnalysis);
      recommendations.push(match);
    }

    // Sort by score and return top recommendations
    return recommendations.sort((a, b) => b.score - a.score).slice(0, limit);
  }
}
