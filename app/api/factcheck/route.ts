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
    console.error("Fact-check API error:", error); // Use the error
    return NextResponse.json({ error: "API error occurred" }, { status: 500 });
  }
}