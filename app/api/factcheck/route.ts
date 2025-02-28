import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");
  const language = searchParams.get("language") || "en";
  const API_KEY = process.env.GOOGLE_API_KEY;

  if (!query) {
    return NextResponse.json({ error: "Query is required" }, { status: 400 });
  }

  if (!API_KEY) {
    console.error("API Key is missing in environment variables");
    return NextResponse.json({ error: "Server configuration error: API key missing" }, { status: 500 });
  }

  try {
    const response = await axios.get(
      "https://factchecktools.googleapis.com/v1alpha1/claims:search",
      {
        params: {
          query,
          key: API_KEY,
          languageCode: language,
        },
      }
    );
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Google API request failed:", {
      message: error instanceof Error ? error.message : "Unknown error",
      response: error instanceof axios.AxiosError && error.response ? {
        status: error.response.status,
        data: error.response.data,
      } : "No response data",
    });
    return NextResponse.json(
      { error: "API error occurred", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}