import { BaxusService } from "@/utils/baxus-service";

const USERNAME = "carriebaxus";

export async function GET() {
  try {
    console.log("Fetching bar data...");
    const response = await fetch(
      "https://services.baxus.co/api/bar/user/carriebaxus",
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );
    const userBar = await response.json();
    if (userBar.length === 0) {
      return Response.json({
        success: false,
        error: "No bar data found",
      });
    }
    const analysis = BaxusService.analyzeCollection(userBar);

    return Response.json({
      success: true,
      data: {
        userBar,
        analysis,
      },
    });
  } catch (error) {
    console.log("Error fetching bar data:", error);
    return Response.json(
      { success: false, error: "Failed to fetch bar data" },
      { status: 500 }
    );
  }
}
