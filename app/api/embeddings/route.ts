import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { embedMany } from "ai";
import { DatasetProduct } from "@/types/types";

const genAI = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { products } = await request.json();

    // Create detailed text descriptions for each product
    const productDescriptions = products.map((product: DatasetProduct) => {
      return `
        Product: ${product.name}
        Category: ${product.spirit_type}
        Characteristics: ${product.proof}° proof, ${product.abv}% ABV
        Price Range: MSRP $${product.avg_msrp}, Fair Price $${product.fair_price}
        Market Performance: ${product.bar_count} bars, ${product.wishlist_count} wishlists
        Rating: ${product.total_score}/100 with ${product.vote_count} votes
      `
        .trim()
        .replace(/\s+/g, " ");
    });

    // Generate embeddings in batches
    const batchSize = 20;
    const allEmbeddings: number[][] = [];

    for (let i = 0; i < productDescriptions.length; i += batchSize) {
      const batch = productDescriptions.slice(i, i + batchSize);
      const { embeddings } = await embedMany({
        model: genAI.textEmbeddingModel("text-embedding-004"),
        values: batch,
      });
      allEmbeddings.push(...embeddings);

      // Add small delay between batches
      if (i + batchSize < productDescriptions.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    // Return embeddings with product names
    const embeddingsMap = products.reduce(
      (
        acc: Record<string, number[]>,
        product: DatasetProduct,
        index: number
      ) => {
        acc[product.name] = allEmbeddings[index];
        return acc;
      },
      {}
    );

    return Response.json({ embeddings: embeddingsMap });
  } catch (error) {
    console.error("Error generating embeddings:", error);
    return Response.json(
      { error: "Failed to generate embeddings" },
      { status: 500 }
    );
  }
}
