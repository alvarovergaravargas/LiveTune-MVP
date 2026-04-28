import { NextRequest, NextResponse } from "next/server";
import { buildSearchQuery } from "@/lib/stations";
import type { LiveSearchResponse, LiveVideo } from "@/lib/types";

export const dynamic = "force-dynamic";

type YouTubeSearchItem = {
  id?: { videoId?: string };
  snippet?: {
    publishedAt?: string;
    channelId?: string;
    title?: string;
    description?: string;
    thumbnails?: {
      high?: { url?: string };
      medium?: { url?: string };
      default?: { url?: string };
    };
    channelTitle?: string;
    liveBroadcastContent?: string;
  };
};

function mapYouTubeItem(item: YouTubeSearchItem): LiveVideo | null {
  const videoId = item.id?.videoId;
  const snippet = item.snippet;
  if (!videoId || !snippet) return null;

  return {
    videoId,
    title: snippet.title ?? "Untitled live stream",
    channelTitle: snippet.channelTitle ?? "Unknown channel",
    channelId: snippet.channelId ?? "",
    description: snippet.description ?? "",
    thumbnailUrl:
      snippet.thumbnails?.high?.url ??
      snippet.thumbnails?.medium?.url ??
      snippet.thumbnails?.default?.url ??
      "",
    publishedAt: snippet.publishedAt ?? "",
    liveBroadcastContent: snippet.liveBroadcastContent ?? "live"
  };
}

export async function GET(request: NextRequest) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const { searchParams } = new URL(request.url);
  const genre = searchParams.get("genre") ?? "lofi";
  const mood = searchParams.get("mood") ?? "focus";
  const query = searchParams.get("q") || buildSearchQuery(genre, mood);

  if (!apiKey) {
    const response: LiveSearchResponse = {
      query,
      items: [],
      error:
        "Missing YOUTUBE_API_KEY. Create .env.local using .env.example and restart the dev server."
    };
    return NextResponse.json(response, { status: 500 });
  }

  const params = new URLSearchParams({
    part: "snippet",
    q: query,
    type: "video",
    eventType: "live",
    videoEmbeddable: "true",
    videoSyndicated: "true",
    safeSearch: "moderate",
    maxResults: "12",
    key: apiKey
  });

  const youtubeUrl = `https://www.googleapis.com/youtube/v3/search?${params.toString()}`;

  try {
    const youtubeResponse = await fetch(youtubeUrl, {
      method: "GET",
      next: { revalidate: 300 }
    });

    const payload = await youtubeResponse.json();

    if (!youtubeResponse.ok) {
      const response: LiveSearchResponse = {
        query,
        items: [],
        error: payload?.error?.message ?? "YouTube API request failed."
      };
      return NextResponse.json(response, { status: youtubeResponse.status });
    }

    const items = Array.isArray(payload.items)
      ? payload.items.map(mapYouTubeItem).filter(Boolean)
      : [];

    const response: LiveSearchResponse = {
      query,
      items: items as LiveVideo[]
    };

    return NextResponse.json(response);
  } catch (error) {
    const response: LiveSearchResponse = {
      query,
      items: [],
      error: error instanceof Error ? error.message : "Unexpected server error."
    };
    return NextResponse.json(response, { status: 500 });
  }
}
