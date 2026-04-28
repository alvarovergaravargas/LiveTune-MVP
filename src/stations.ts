export type Genre = {
  id: string;
  label: string;
  description: string;
  baseQueries: string[];
};

export type Mood = {
  id: string;
  label: string;
  queryBoost: string;
};

export const GENRES: Genre[] = [
  {
    id: "lofi",
    label: "Lo-fi",
    description: "Beats suaves para estudiar, trabajar o concentrarte.",
    baseQueries: ["lofi hip hop live", "lofi live radio", "beats to study live"]
  },
  {
    id: "jazz",
    label: "Jazz",
    description: "Jazz en vivo para café, noche o trabajo ligero.",
    baseQueries: ["jazz live radio", "coffee jazz live", "smooth jazz live"]
  },
  {
    id: "ambient",
    label: "Ambient",
    description: "Texturas suaves, música espacial y sonidos de fondo.",
    baseQueries: ["ambient music live", "space ambient live", "meditation ambient live"]
  },
  {
    id: "classical",
    label: "Classical",
    description: "Piano, orquesta y música instrumental clásica.",
    baseQueries: ["classical music live", "piano classical live", "orchestra music live"]
  },
  {
    id: "synthwave",
    label: "Synthwave",
    description: "Retrowave, cyberpunk y electrónica nostálgica.",
    baseQueries: ["synthwave live radio", "retrowave live", "cyberpunk music live"]
  },
  {
    id: "latin",
    label: "Latin Chill",
    description: "Música latina suave y playlists en vivo para ambiente casual.",
    baseQueries: ["latin chill live music", "latin pop live radio", "spanish chill music live"]
  },
  {
    id: "worship",
    label: "Worship / Sacred",
    description: "Música espiritual, canto gregoriano y worship instrumental.",
    baseQueries: ["gregorian chant live", "catholic music live", "worship instrumental live"]
  },
  {
    id: "study",
    label: "Deep Work",
    description: "Música instrumental pensada para concentración profunda.",
    baseQueries: ["deep focus music live", "study music live", "work music live"]
  }
];

export const MOODS: Mood[] = [
  { id: "focus", label: "Focus", queryBoost: "focus study work" },
  { id: "relax", label: "Relax", queryBoost: "relax chill calm" },
  { id: "night", label: "Night", queryBoost: "night sleep calm" },
  { id: "energy", label: "Energy", queryBoost: "upbeat energetic" }
];

export function buildSearchQuery(genreId: string, moodId: string): string {
  const genre = GENRES.find((item) => item.id === genreId) ?? GENRES[0];
  const mood = MOODS.find((item) => item.id === moodId) ?? MOODS[0];
  const baseQuery = genre.baseQueries[Math.floor(Math.random() * genre.baseQueries.length)];
  return `${baseQuery} ${mood.queryBoost}`.trim();
}
