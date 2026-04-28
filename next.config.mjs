"use client";

import { useMemo, useState } from "react";
import { genres, moods, type GenreKey, type MoodKey } from "./lib/stations";

type LiveVideo = {
  videoId: string;
  title: string;
  description: string;
  channelTitle: string;
  channelId: string;
  publishedAt: string;
  thumbnail: string;
};

type ApiResponse = {
  query?: string;
  videos?: LiveVideo[];
  error?: string;
  details?: string;
};

export default function HomePage() {
  const [genre, setGenre] = useState<GenreKey>("lofi");
  const [mood, setMood] = useState<MoodKey>("focus");
  const [videos, setVideos] = useState<LiveVideo[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState<string[]>([]);

  const currentVideo = videos[currentIndex];

  const embedUrl = useMemo(() => {
    if (!currentVideo?.videoId) return "";
    return `https://www.youtube-nocookie.com/embed/${currentVideo.videoId}?autoplay=1&rel=0`;
  }, [currentVideo]);

  async function loadStation() {
    setLoading(true);
    setError("");
    setCurrentIndex(0);

    try {
      const response = await fetch(`/api/search?genre=${genre}&mood=${mood}`);
      const data = (await response.json()) as ApiResponse;

      if (!response.ok) {
        throw new Error(data.error || "Could not load station.");
      }

      setVideos(data.videos ?? []);
      setQuery(data.query ?? "");

      if (!data.videos?.length) {
        setError("No live streams found for this station. Try another genre or mood.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error while loading station.");
      setVideos([]);
    } finally {
      setLoading(false);
    }
  }

  function nextStation() {
    if (!videos.length) return;
    setCurrentIndex((index) => (index + 1) % videos.length);
  }

  function saveChannel() {
    if (!currentVideo?.channelTitle) return;
    const value = `${currentVideo.channelTitle} — ${currentVideo.channelId}`;
    const next = Array.from(new Set([...saved, value]));
    setSaved(next);
    window.localStorage.setItem("livetune_saved_channels", JSON.stringify(next));
  }

  return (
    <main className="page-shell">
      <section className="hero">
        <div>
          <p className="eyebrow">LiveTune MVP · Week 1</p>
          <h1>Your clean YouTube Live music radio.</h1>
          <p className="subtitle">
            Pick a genre and mood, then discover embeddable YouTube live streams without the distraction of the full YouTube feed.
          </p>
        </div>
      </section>

      <section className="control-panel">
        <div>
          <label htmlFor="genre">Genre</label>
          <select id="genre" value={genre} onChange={(event) => setGenre(event.target.value as GenreKey)}>
            {genres.map((item) => (
              <option key={item.key} value={item.key}>{item.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="mood">Mood</label>
          <select id="mood" value={mood} onChange={(event) => setMood(event.target.value as MoodKey)}>
            {moods.map((item) => (
              <option key={item.key} value={item.key}>{item.label}</option>
            ))}
          </select>
        </div>

        <button className="primary" onClick={loadStation} disabled={loading}>
          {loading ? "Searching live streams..." : "Start station"}
        </button>
      </section>

      {error && <div className="error-card">{error}</div>}

      <section className="player-grid">
        <div className="player-card">
          {currentVideo ? (
            <iframe
              src={embedUrl}
              title={currentVideo.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <div className="empty-player">Choose a genre and mood to start your first live station.</div>
          )}
        </div>

        <aside className="now-playing">
          <p className="eyebrow">Now playing</p>
          <h2>{currentVideo?.title ?? "No station loaded"}</h2>
          <p>{currentVideo?.channelTitle ?? "Your selected live stream will appear here."}</p>
          {query && <p className="query">Search query: {query}</p>}

          <div className="actions">
            <button onClick={nextStation} disabled={!videos.length}>Next station</button>
            <button onClick={saveChannel} disabled={!currentVideo}>Save channel</button>
          </div>

          <div className="queue-count">{videos.length ? `${currentIndex + 1} of ${videos.length} live results` : "No queue yet"}</div>
        </aside>
      </section>

      {videos.length > 0 && (
        <section className="queue">
          <h2>Live queue</h2>
          <div className="queue-list">
            {videos.map((video, index) => (
              <button
                key={video.videoId}
                className={index === currentIndex ? "queue-item active" : "queue-item"}
                onClick={() => setCurrentIndex(index)}
              >
                {video.thumbnail && <img src={video.thumbnail} alt="" />}
                <span>{video.title}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {saved.length > 0 && (
        <section className="saved">
          <h2>Saved channels</h2>
          {saved.map((item) => <p key={item}>{item}</p>)}
        </section>
      )}
    </main>
  );
}
