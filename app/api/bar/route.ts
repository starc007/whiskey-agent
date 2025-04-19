import { BaxusService } from "@/utils/baxus-service";

export async function GET(request: Request) {
  try {
    // Get username from URL params
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    if (!username) {
      return Response.json(
        {
          success: false,
          error: "Username is required",
        },
        { status: 400 }
      );
    }

    const response = await fetch(
      `https://services.baxus.co/api/bar/user/${username}`,
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
