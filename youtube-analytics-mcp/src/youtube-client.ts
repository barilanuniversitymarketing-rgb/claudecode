import { google, youtubeAnalytics_v2, youtube_v3 } from "googleapis";
import { OAuth2Client } from "google-auth-library";

export interface VideoMetricsParams {
  videoIds: string[];
  startDate: string;
  endDate: string;
  metrics?: string[];
}

export interface ChannelReportParams {
  channelId?: string;
  startDate: string;
  endDate: string;
  metrics?: string[];
  dimensions?: string[];
  filters?: string;
  sort?: string;
  maxResults?: number;
}

export interface CustomQueryParams {
  ids: string;
  startDate: string;
  endDate: string;
  metrics: string;
  dimensions?: string;
  filters?: string;
  sort?: string;
  maxResults?: number;
  startIndex?: number;
  currency?: string;
}

export interface TopVideosParams {
  channelId?: string;
  startDate: string;
  endDate: string;
  metrics?: string;
  maxResults?: number;
}

export interface AudienceRetentionParams {
  videoId: string;
  startDate: string;
  endDate: string;
}

export class YouTubeAnalyticsClient {
  private analyticsClient: youtubeAnalytics_v2.Youtubeanalytics;
  private youtubeClient: youtube_v3.Youtube;

  constructor(auth: OAuth2Client) {
    this.analyticsClient = google.youtubeAnalytics({ version: "v2", auth });
    this.youtubeClient = google.youtube({ version: "v3", auth });
  }

  async getVideoMetrics(params: VideoMetricsParams) {
    const defaultMetrics = [
      "views",
      "estimatedMinutesWatched",
      "averageViewDuration",
      "averageViewPercentage",
      "likes",
      "dislikes",
      "comments",
      "shares",
      "subscribersGained",
      "subscribersLost",
    ];

    const metrics = params.metrics ?? defaultMetrics;
    const videoFilter = `video==${params.videoIds.join(",")}`;

    const response = await this.analyticsClient.reports.query({
      ids: "channel==MINE",
      startDate: params.startDate,
      endDate: params.endDate,
      metrics: metrics.join(","),
      dimensions: "video",
      filters: videoFilter,
      sort: "-views",
    });

    return response.data;
  }

  async listChannelReports(params: ChannelReportParams) {
    const defaultMetrics = [
      "views",
      "estimatedMinutesWatched",
      "averageViewDuration",
      "likes",
      "comments",
      "shares",
      "subscribersGained",
      "subscribersLost",
    ];

    const channelId = params.channelId ?? "MINE";
    const ids = channelId === "MINE" ? "channel==MINE" : `channel==${channelId}`;

    const response = await this.analyticsClient.reports.query({
      ids,
      startDate: params.startDate,
      endDate: params.endDate,
      metrics: (params.metrics ?? defaultMetrics).join(","),
      dimensions: params.dimensions?.join(","),
      filters: params.filters,
      sort: params.sort,
      maxResults: params.maxResults,
    });

    return response.data;
  }

  async queryCustomAnalytics(params: CustomQueryParams) {
    const response = await this.analyticsClient.reports.query({
      ids: params.ids,
      startDate: params.startDate,
      endDate: params.endDate,
      metrics: params.metrics,
      dimensions: params.dimensions,
      filters: params.filters,
      sort: params.sort,
      maxResults: params.maxResults,
      startIndex: params.startIndex,
      currency: params.currency,
    });

    return response.data;
  }

  async getTopVideos(params: TopVideosParams) {
    const channelId = params.channelId ?? "MINE";
    const ids = channelId === "MINE" ? "channel==MINE" : `channel==${channelId}`;

    const response = await this.analyticsClient.reports.query({
      ids,
      startDate: params.startDate,
      endDate: params.endDate,
      metrics: params.metrics ?? "views,estimatedMinutesWatched,likes,comments",
      dimensions: "video",
      sort: "-views",
      maxResults: params.maxResults ?? 10,
    });

    // Enrich with video titles if we have results
    const data = response.data;
    if (data.rows && data.rows.length > 0 && data.columnHeaders) {
      const videoIdIndex = data.columnHeaders.findIndex(
        (h) => h.name === "video"
      );
      if (videoIdIndex >= 0) {
        const videoIds = data.rows.map((row) => String(row[videoIdIndex]));
        try {
          const videoDetails = await this.youtubeClient.videos.list({
            part: ["snippet"],
            id: videoIds,
          });

          const titleMap = new Map(
            videoDetails.data.items?.map((item) => [
              item.id!,
              item.snippet?.title ?? "Unknown",
            ]) ?? []
          );

          return {
            ...data,
            videoTitles: Object.fromEntries(titleMap),
          };
        } catch {
          // Return without titles if enrichment fails
        }
      }
    }

    return data;
  }

  async getAudienceRetention(params: AudienceRetentionParams) {
    const response = await this.analyticsClient.reports.query({
      ids: "channel==MINE",
      startDate: params.startDate,
      endDate: params.endDate,
      metrics: "audienceWatchRatio,relativeRetentionPerformance",
      dimensions: "elapsedVideoTimeRatio",
      filters: `video==${params.videoId}`,
    });

    return response.data;
  }

  async getChannelInfo() {
    const response = await this.youtubeClient.channels.list({
      part: ["snippet", "statistics", "contentDetails"],
      mine: true,
    });

    return response.data;
  }

  async getTrafficSources(params: {
    startDate: string;
    endDate: string;
    channelId?: string;
  }) {
    const channelId = params.channelId ?? "MINE";
    const ids = channelId === "MINE" ? "channel==MINE" : `channel==${channelId}`;

    const response = await this.analyticsClient.reports.query({
      ids,
      startDate: params.startDate,
      endDate: params.endDate,
      metrics: "views,estimatedMinutesWatched",
      dimensions: "insightTrafficSourceType",
      sort: "-views",
    });

    return response.data;
  }

  async getDemographics(params: {
    startDate: string;
    endDate: string;
    channelId?: string;
  }) {
    const channelId = params.channelId ?? "MINE";
    const ids = channelId === "MINE" ? "channel==MINE" : `channel==${channelId}`;

    const response = await this.analyticsClient.reports.query({
      ids,
      startDate: params.startDate,
      endDate: params.endDate,
      metrics: "viewerPercentage",
      dimensions: "ageGroup,gender",
      sort: "-viewerPercentage",
    });

    return response.data;
  }
}
