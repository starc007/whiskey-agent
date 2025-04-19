import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { BaxusService } from "./baxus-service";
import { RecommendationEngine } from "./recommendation-engine";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
