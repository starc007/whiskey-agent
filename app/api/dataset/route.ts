export const runtime = "edge";

import { NextResponse } from "next/server";
import { parse } from "csv-parse/sync";

export async function GET() {
  try {
    // Assuming the CSV is in the public directory and accessible via URL
    const response = await fetch(
      new URL("/dataset.csv", process.env.NEXT_PUBLIC_BASE_URL)
    );
    const fileContent = await response.text();

    const rawData = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      cast: true,
    });

    return NextResponse.json({ data: rawData });
  } catch (error) {
    console.error("Error reading dataset:", error);
    return NextResponse.json(
      { error: "Failed to load dataset" },
      { status: 500 }
    );
  }
}
