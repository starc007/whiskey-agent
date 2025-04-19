export const runtime = "edge";

import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { parse } from "csv-parse/sync";

export async function GET() {
  try {
    const csvPath = path.join(process.cwd(), "public", "dataset.csv");
    const fileContent = fs.readFileSync(csvPath, "utf-8");

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
