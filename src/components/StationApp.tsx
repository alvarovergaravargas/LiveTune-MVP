"use client";

import { useEffect, useMemo, useState } from "react";
import { GENRES, MOODS } from "@/lib/stations";
import type { LiveSearchResponse, LiveVideo } from "@/lib/types";

function getEmbedUrl(videoId: string) {
  const params = new URLSearchParams({
    autoplay: "1",
    rel: "0",
    modestbranding: "1",
    playsinline: "1"
  });

  return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
}

function formatDate(value: string) {
  if (!value) return "Live now";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

export default function StationApp() {
  const [genre, setGenre] = useState(GENRES[0].id);
  const [mood, setMood] = useState(MOODS[0].id);
  const [videos, setVideos] = useState<LiveVideo[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<string[]>([]);

  const activeVideo = videos[activeIndex];
  const selectedGenre = useMemo(
    () => GENRES.find((item) => item.id === genre) ?? GENRES[0],
    [genre]
  );

  useEffect(() => {
    const stored = window.localStorage.getItem("livetune:saved");
    if (stored) setSaved(JSON.parse(stored));
  }, []);

  useEffect(() => {
    window.localStorage.setItem("livetune:saved", JSON.stringify(saved));
  }, [saved]);

  async function loadStation() {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({ genre, mood });
      const response = await fetch(`/api/youtube/live?${params.toString()}`);
      const payload = (await response.json()) as LiveSearchResponse;

      if (!response.ok || payload.error) {
        throw new Error(payload.error ?? "Could not load station.");
      }

      setQuery(payload.query);
      setVideos(payload.items);
      setActiveIndex(0);

      if (payload.items.length === 0) {
        setError("No live streams were found for this station. Try another mood or genre.");
      }
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unexpected error.");
      setVideos([]);
      setActiveIndex(0);
    } finally {
      setIsLoading(false);
    }
  }

  function nextVideo() {
    if (videos.length === 0) return;
    setActiveIndex((current) => (current + 1) % videos.length);
  }

  function toggleSave(video: LiveVideo) {
    setSaved((current) =>
      current.includes(video.channelId)
        ? current.filter((id) => id !== video.channelId)
        : [...current, video.channelId]
    );
  }

  return (
    <main className="page">
      <section className="hero">
        <div>
          <div className="eyebrow">Week 1 MVP</div>
          <h1>LiveTune</h1>
          <p>
            A simple web radio that discovers YouTube live music streams based on your
            preferred genre and mood. Pick a station, press play, and move through a
            curated queue.
          </p>
        </div>

        <div className="panel status-card">
          <strong>Selected station</strong>
          <span>
            {selectedGenre.label} — {selectedGenre.description}
          </span>
        </div>
      </section>

      <section className="panel controls">
        <div className="field">
          <label htmlFor="genre">Genre</label>
          <select id="genre" value={genre} onChange={(event) => setGenre(event.target.value)}>
            {GENRES.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="mood">Mood</label>
          <select id="mood" value={mood} onChange={(event) => setMood(event.target.value)}>
            {MOODS.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <button className="primary-button" onClick={loadStation} disabled={isLoading}>
          {isLoading ? "Tuning..." : "Start station"}
        </button>
      </section>

      {error && <div className="error">{error}</div>}

      <section className="grid">
        <article className="panel player-card">
          {activeVideo ? (
            <>
              <div className="player-frame">
                <iframe
                  key={activeVideo.videoId}
                  src={getEmbedUrl(activeVideo.videoId)}
                  title={activeVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>

              <div className="now-playing">
                <span className="badge">● Live</span>
                <h2>{activeVideo.title}</h2>
                <div className="meta">
                  {activeVideo.channelTitle} · {formatDate(activeVideo.publishedAt)}
                  {query ? ` · Search: ${query}` : ""}
                </div>

                <div className="actions">
                  <button className="secondary-button" onClick={nextVideo}>
                    Next station
                  </button>
                  <button className="secondary-button" onClick={() => toggleSave(activeVideo)}>
                    {saved.includes(activeVideo.channelId) ? "Saved channel" : "Save channel"}
                  </button>
                  <a
                    className="secondary-button"
                    href={`https://www.youtube.com/watch?v=${activeVideo.videoId}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ display: "inline-flex", alignItems: "center", textDecoration: "none" }}
                  >
                    Open on YouTube
                  </a>
                </div>
              </div>
            </>
          ) : (
            <div className="empty-player">
              <div>
                <h2>No station loaded yet</h2>
                <p>Choose a genre and mood, then press Start station.</p>
              </div>
            </div>
          )}
        </article>

        <aside className="panel queue">
          <h3>Live queue</h3>
          {videos.length === 0 ? (
            <p className="meta">Your live results will appear here.</p>
          ) : (
            videos.map((video, index) => (
              <button
                key={video.videoId}
                className={`video-item ${index === activeIndex ? "active" : ""}`}
                onClick={() => setActiveIndex(index)}
              >
                {video.thumbnailUrl ? <img src={video.thumbnailUrl} alt="" /> : <div />}
                <div>
                  <strong>{video.title}</strong>
                  <span>{video.channelTitle}</span>
                </div>
              </button>
            ))
          )}
        </aside>
      </section>
    </main>
  );
}
