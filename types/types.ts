export interface BaxusProduct {
  id: number;
  name: string;
  image_url: string;
  brand_id: number;
  brand: string;
  spirit: string;
  size: string;
  proof: number;
  average_msrp: number;
  fair_price: number;
  shelf_price: number;
  popularity: number;
  barcode: string;
  barrel_pick: boolean;
  private: boolean;
  user_added: boolean;
}

export interface BaxusBarItem {
  id: number;
  bar_id: number;
  price: number | null;
  note: string | null;
  created_at: string;
  updated_at: string;
  user_id: number;
  release_id: number;
  fill_percentage: number;
  added: string;
  user: {
    user_name: string;
  };
  product: BaxusProduct;
}

export interface AnalyzedCollection {
  favoriteSpirits: Array<{
    spirit: string;
    count: number;
    percentage: number;
  }>;
  priceRange: {
    min: number;
    max: number;
    average: number;
    median: number;
  };
  proofPreferences: {
    average: number;
    median: number;
    range: {
      min: number;
      max: number;
    };
  };
  collectionStats: {
    totalBottles: number;
    totalValue: number;
    averageBottleValue: number;
    uniqueSpiritTypes: number;
  };
}

export interface DatasetProduct {
  name: string;
  size: string;
  proof: number;
  abv: number;
  spirit_type: string;
  brand_id: number;
  popularity: number;
  image_url: string;
  avg_msrp: number;
  fair_price: number;
  shelf_price: number;
  total_score: number;
  wishlist_count: number;
  vote_count: number;
  bar_count: number;
  ranking: number;
}

export interface ProductMatch {
  datasetProduct: DatasetProduct;
  score: number;
  reasons: string[];
}

export interface SerializedRecommendation {
  name: string;
  spirit: string;
  proof: number;
  price: number;
  score: number;
  reasons: string[];
}
