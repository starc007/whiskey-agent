import { DatasetProduct } from "@/types/types";

export class EmbeddingService {
  private static embeddings: Map<string, number[]> = new Map();
  static isInitialized = false;

  static async initialize(dataset: DatasetProduct[]) {
    if (this.isInitialized) return;

    try {
      // Call server endpoint to generate embeddings
      const response = await fetch("/api/embeddings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ products: dataset }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate embeddings");
      }

      const { embeddings } = await response.json();

      // Store embeddings
      Object.entries(embeddings).forEach(([name, embedding]) => {
        this.embeddings.set(name, embedding as number[]);
      });

      this.isInitialized = true;
      console.log(`Loaded embeddings for ${dataset.length} products`);
    } catch (error) {
      console.error("Error initializing embeddings:", error);
      throw error;
    }
  }

  static getEmbedding(productName: string): number[] | undefined {
    return this.embeddings.get(productName);
  }

  static calculateSimilarity(
    embedding1: number[],
    embedding2: number[]
  ): number {
    if (!embedding1 || !embedding2 || embedding1.length !== embedding2.length) {
      return 0;
    }

    // Calculate cosine similarity
    const dotProduct = embedding1.reduce(
      (sum, val, i) => sum + val * embedding2[i],
      0
    );
    const magnitude1 = Math.sqrt(
      embedding1.reduce((sum, val) => sum + val * val, 0)
    );
    const magnitude2 = Math.sqrt(
      embedding2.reduce((sum, val) => sum + val * val, 0)
    );

    return dotProduct / (magnitude1 * magnitude2);
  }

  static findSimilarProducts(
    targetProduct: DatasetProduct,
    dataset: DatasetProduct[],
    limit: number = 5,
    minSimilarity: number = 0.7
  ): { product: DatasetProduct; similarity: number }[] {
    const targetEmbedding = this.getEmbedding(targetProduct.name);
    if (!targetEmbedding) return [];

    const similarities = dataset
      .filter((product) => product.name !== targetProduct.name)
      .map((product) => {
        const productEmbedding = this.getEmbedding(product.name);
        if (!productEmbedding) return { product, similarity: 0 };

        return {
          product,
          similarity: this.calculateSimilarity(
            targetEmbedding,
            productEmbedding
          ),
        };
      })
      .filter((item) => item.similarity >= minSimilarity)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);

    return similarities;
  }
}
