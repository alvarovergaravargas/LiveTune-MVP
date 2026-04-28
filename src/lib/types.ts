export type LiveVideo = {
  videoId: string;
  title: string;
  channelTitle: string;
  channelId: string;
  description: string;
  thumbnailUrl: string;
  publishedAt: string;
  liveBroadcastContent: string;
};

export type LiveSearchResponse = {
  query: string;
  items: LiveVideo[];
  error?: string;
};
