:root {
  color-scheme: dark;
  --bg: #070914;
  --card: rgba(255, 255, 255, 0.08);
  --card-strong: rgba(255, 255, 255, 0.13);
  --text: #f5f7fb;
  --muted: #aab3c5;
  --line: rgba(255, 255, 255, 0.14);
  --accent: #8b5cf6;
  --accent-2: #22d3ee;
}

* { box-sizing: border-box; }

body {
  margin: 0;
  background:
    radial-gradient(circle at top left, rgba(139, 92, 246, 0.28), transparent 34rem),
    radial-gradient(circle at top right, rgba(34, 211, 238, 0.16), transparent 32rem),
    var(--bg);
  color: var(--text);
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

button, select { font: inherit; }

.page-shell {
  width: min(1180px, calc(100% - 32px));
  margin: 0 auto;
  padding: 48px 0;
}

.hero {
  display: grid;
  gap: 20px;
  margin-bottom: 28px;
}

.eyebrow {
  margin: 0 0 10px;
  color: var(--accent-2);
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: 0.78rem;
  font-weight: 700;
}

h1 {
  max-width: 820px;
  margin: 0;
  font-size: clamp(2.4rem, 7vw, 5.8rem);
  line-height: 0.94;
  letter-spacing: -0.07em;
}

.subtitle {
  max-width: 740px;
  color: var(--muted);
  font-size: 1.1rem;
  line-height: 1.7;
}

.control-panel, .player-card, .now-playing, .queue, .saved, .error-card {
  border: 1px solid var(--line);
  background: var(--card);
  box-shadow: 0 24px 90px rgba(0,0,0,0.28);
  backdrop-filter: blur(18px);
  border-radius: 28px;
}

.control-panel {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  padding: 18px;
  margin-bottom: 22px;
}

label {
  display: block;
  color: var(--muted);
  font-size: 0.88rem;
  margin: 0 0 8px;
}

select, button {
  width: 100%;
  min-height: 48px;
  border-radius: 16px;
  border: 1px solid var(--line);
  color: var(--text);
  background: rgba(255, 255, 255, 0.08);
  padding: 0 14px;
}

button { cursor: pointer; transition: transform .18s ease, background .18s ease; }
button:hover:not(:disabled) { transform: translateY(-1px); background: var(--card-strong); }
button:disabled { opacity: 0.55; cursor: not-allowed; }

.primary {
  align-self: end;
  border: 0;
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  color: white;
  font-weight: 800;
}

.error-card { padding: 16px 18px; margin-bottom: 22px; color: #fecaca; }

.player-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.7fr) minmax(320px, 0.8fr);
  gap: 22px;
}

.player-card { overflow: hidden; aspect-ratio: 16/9; }
.player-card iframe { width: 100%; height: 100%; border: 0; display: block; }
.empty-player { height: 100%; display: grid; place-items: center; color: var(--muted); padding: 24px; text-align: center; }

.now-playing { padding: 24px; }
.now-playing h2 { margin: 0 0 12px; font-size: 1.45rem; line-height: 1.2; }
.now-playing p { color: var(--muted); line-height: 1.55; }
.query { font-size: 0.86rem; word-break: break-word; }
.actions { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 18px; }
.queue-count { margin-top: 18px; color: var(--muted); font-size: 0.92rem; }

.queue, .saved { margin-top: 22px; padding: 22px; }
.queue h2, .saved h2 { margin: 0 0 16px; }
.queue-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 12px; }
.queue-item { height: auto; text-align: left; padding: 10px; display: grid; grid-template-columns: 76px 1fr; gap: 10px; align-items: center; }
.queue-item.active { outline: 2px solid var(--accent-2); }
.queue-item img { width: 76px; height: 48px; object-fit: cover; border-radius: 10px; }
.queue-item span { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; font-size: 0.9rem; }
.saved p { color: var(--muted); }

@media (max-width: 850px) {
  .control-panel, .player-grid { grid-template-columns: 1fr; }
  .primary { align-self: auto; }
}
