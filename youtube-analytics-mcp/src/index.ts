#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { createOAuth2Client } from "./auth.js";
import { YouTubeAnalyticsClient } from "./youtube-client.js";

const server = new Server(
  {
    name: "youtube-analytics-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

function getClient(): YouTubeAnalyticsClient {
  const auth = createOAuth2Client();
  return new YouTubeAnalyticsClient(auth);
}

// Tool schemas
const GetVideoMetricsSchema = z.object({
  videoIds: z.array(z.string()).min(1).describe("List of YouTube video IDs"),
  startDate: z.string().describe("Start date in YYYY-MM-DD format"),
  endDate: z.string().describe("End date in YYYY-MM-DD format"),
  metrics: z
    .array(z.string())
    .optional()
    .describe(
      "Metrics to retrieve (defaults to views, watchTime, likes, comments, etc.)"
    ),
});

const ListChannelReportsSchema = z.object({
  channelId: z
    .string()
    .optional()
    .describe("Channel ID (defaults to authenticated user's channel)"),
  startDate: z.string().describe("Start date in YYYY-MM-DD format"),
  endDate: z.string().describe("End date in YYYY-MM-DD format"),
  metrics: z.array(z.string()).optional().describe("Metrics to retrieve"),
  dimensions: z
    .array(z.string())
    .optional()
    .describe("Dimensions to group by (e.g. day, month, video)"),
  filters: z.string().optional().describe("Filter string (e.g. video==VIDEO_ID)"),
  sort: z
    .string()
    .optional()
    .describe("Sort field, prefix with - for descending (e.g. -views)"),
  maxResults: z.number().int().min(1).max(200).optional(),
});

const QueryCustomAnalyticsSchema = z.object({
  ids: z
    .string()
    .describe("Resource IDs (e.g. channel==MINE or channel==UC...)"),
  startDate: z.string().describe("Start date in YYYY-MM-DD format"),
  endDate: z.string().describe("End date in YYYY-MM-DD format"),
  metrics: z
    .string()
    .describe("Comma-separated list of metrics (e.g. views,likes)"),
  dimensions: z
    .string()
    .optional()
    .describe("Comma-separated dimensions (e.g. video,day)"),
  filters: z.string().optional().describe("Filter expression"),
  sort: z.string().optional().describe("Sort expression"),
  maxResults: z.number().int().min(1).max(200).optional(),
  startIndex: z.number().int().min(1).optional(),
  currency: z.string().optional().describe("ISO 4217 currency code"),
});

const TopVideosSchema = z.object({
  channelId: z
    .string()
    .optional()
    .describe("Channel ID (defaults to authenticated user's channel)"),
  startDate: z.string().describe("Start date in YYYY-MM-DD format"),
  endDate: z.string().describe("End date in YYYY-MM-DD format"),
  metrics: z
    .string()
    .optional()
    .describe("Comma-separated metrics (default: views,estimatedMinutesWatched,likes,comments)"),
  maxResults: z.number().int().min(1).max(200).optional().default(10),
});

const AudienceRetentionSchema = z.object({
  videoId: z.string().describe("YouTube video ID"),
  startDate: z.string().describe("Start date in YYYY-MM-DD format"),
  endDate: z.string().describe("End date in YYYY-MM-DD format"),
});

const DateRangeChannelSchema = z.object({
  startDate: z.string().describe("Start date in YYYY-MM-DD format"),
  endDate: z.string().describe("End date in YYYY-MM-DD format"),
  channelId: z
    .string()
    .optional()
    .describe("Channel ID (defaults to authenticated user's channel)"),
});

// Tool definitions
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "get_video_metrics",
      description:
        "Get analytics metrics for one or more YouTube videos. Returns views, watch time, likes, comments, shares, and subscriber changes.",
      inputSchema: {
        type: "object",
        properties: {
          videoIds: {
            type: "array",
            items: { type: "string" },
            description: "List of YouTube video IDs",
          },
          startDate: {
            type: "string",
            description: "Start date in YYYY-MM-DD format",
          },
          endDate: {
            type: "string",
            description: "End date in YYYY-MM-DD format",
          },
          metrics: {
            type: "array",
            items: { type: "string" },
            description: "Optional list of specific metrics to retrieve",
          },
        },
        required: ["videoIds", "startDate", "endDate"],
      },
    },
    {
      name: "list_channel_reports",
      description:
        "List analytics reports for a YouTube channel. Supports time-based and dimension-based grouping.",
      inputSchema: {
        type: "object",
        properties: {
          channelId: {
            type: "string",
            description: "Channel ID (defaults to authenticated user's channel)",
          },
          startDate: {
            type: "string",
            description: "Start date in YYYY-MM-DD format",
          },
          endDate: {
            type: "string",
            description: "End date in YYYY-MM-DD format",
          },
          metrics: {
            type: "array",
            items: { type: "string" },
            description: "Metrics to retrieve",
          },
          dimensions: {
            type: "array",
            items: { type: "string" },
            description: "Dimensions to group by (e.g. day, month, video)",
          },
          filters: {
            type: "string",
            description: "Filter string (e.g. video==VIDEO_ID)",
          },
          sort: {
            type: "string",
            description: "Sort field, prefix with - for descending (e.g. -views)",
          },
          maxResults: {
            type: "number",
            description: "Maximum number of results (1-200)",
          },
        },
        required: ["startDate", "endDate"],
      },
    },
    {
      name: "query_custom_analytics",
      description:
        "Run a fully custom YouTube Analytics query with fine-grained control over metrics, dimensions, filters, and sorting.",
      inputSchema: {
        type: "object",
        properties: {
          ids: {
            type: "string",
            description: "Resource IDs (e.g. channel==MINE or channel==UCxxxxxx)",
          },
          startDate: {
            type: "string",
            description: "Start date in YYYY-MM-DD format",
          },
          endDate: {
            type: "string",
            description: "End date in YYYY-MM-DD format",
          },
          metrics: {
            type: "string",
            description: "Comma-separated list of metrics (e.g. views,likes)",
          },
          dimensions: {
            type: "string",
            description: "Comma-separated dimensions (e.g. video,day)",
          },
          filters: {
            type: "string",
            description: "Filter expression",
          },
          sort: {
            type: "string",
            description: "Sort expression",
          },
          maxResults: {
            type: "number",
            description: "Maximum results (1-200)",
          },
          startIndex: {
            type: "number",
            description: "1-based index for pagination",
          },
          currency: {
            type: "string",
            description: "ISO 4217 currency code for revenue metrics",
          },
        },
        required: ["ids", "startDate", "endDate", "metrics"],
      },
    },
    {
      name: "get_top_videos",
      description:
        "Get the top performing videos for a channel in a date range, sorted by views. Includes video titles.",
      inputSchema: {
        type: "object",
        properties: {
          channelId: {
            type: "string",
            description: "Channel ID (defaults to authenticated user's channel)",
          },
          startDate: {
            type: "string",
            description: "Start date in YYYY-MM-DD format",
          },
          endDate: {
            type: "string",
            description: "End date in YYYY-MM-DD format",
          },
          metrics: {
            type: "string",
            description:
              "Comma-separated metrics (default: views,estimatedMinutesWatched,likes,comments)",
          },
          maxResults: {
            type: "number",
            description: "Number of top videos to return (default: 10)",
          },
        },
        required: ["startDate", "endDate"],
      },
    },
    {
      name: "get_audience_retention",
      description:
        "Get audience retention data for a specific video, showing watch ratio at each point in the video.",
      inputSchema: {
        type: "object",
        properties: {
          videoId: {
            type: "string",
            description: "YouTube video ID",
          },
          startDate: {
            type: "string",
            description: "Start date in YYYY-MM-DD format",
          },
          endDate: {
            type: "string",
            description: "End date in YYYY-MM-DD format",
          },
        },
        required: ["videoId", "startDate", "endDate"],
      },
    },
    {
      name: "get_channel_info",
      description:
        "Get information about the authenticated user's YouTube channel, including subscriber count, view count, and video count.",
      inputSchema: {
        type: "object",
        properties: {},
        required: [],
      },
    },
    {
      name: "get_traffic_sources",
      description:
        "Get traffic source breakdown for a channel, showing which sources drive the most views and watch time.",
      inputSchema: {
        type: "object",
        properties: {
          startDate: {
            type: "string",
            description: "Start date in YYYY-MM-DD format",
          },
          endDate: {
            type: "string",
            description: "End date in YYYY-MM-DD format",
          },
          channelId: {
            type: "string",
            description: "Channel ID (defaults to authenticated user's channel)",
          },
        },
        required: ["startDate", "endDate"],
      },
    },
    {
      name: "get_demographics",
      description:
        "Get viewer demographics (age groups and gender) for a channel.",
      inputSchema: {
        type: "object",
        properties: {
          startDate: {
            type: "string",
            description: "Start date in YYYY-MM-DD format",
          },
          endDate: {
            type: "string",
            description: "End date in YYYY-MM-DD format",
          },
          channelId: {
            type: "string",
            description: "Channel ID (defaults to authenticated user's channel)",
          },
        },
        required: ["startDate", "endDate"],
      },
    },
  ],
}));

// Tool handlers
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    const client = getClient();

    switch (name) {
      case "get_video_metrics": {
        const params = GetVideoMetricsSchema.parse(args);
        const result = await client.getVideoMetrics(params);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }

      case "list_channel_reports": {
        const params = ListChannelReportsSchema.parse(args);
        const result = await client.listChannelReports(params);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }

      case "query_custom_analytics": {
        const params = QueryCustomAnalyticsSchema.parse(args);
        const result = await client.queryCustomAnalytics(params);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }

      case "get_top_videos": {
        const params = TopVideosSchema.parse(args);
        const result = await client.getTopVideos(params);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }

      case "get_audience_retention": {
        const params = AudienceRetentionSchema.parse(args);
        const result = await client.getAudienceRetention(params);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }

      case "get_channel_info": {
        const result = await client.getChannelInfo();
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }

      case "get_traffic_sources": {
        const params = DateRangeChannelSchema.parse(args);
        const result = await client.getTrafficSources(params);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }

      case "get_demographics": {
        const params = DateRangeChannelSchema.parse(args);
        const result = await client.getDemographics(params);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }

      default:
        return {
          content: [{ type: "text", text: `Unknown tool: ${name}` }],
          isError: true,
        };
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      content: [{ type: "text", text: `Error: ${message}` }],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("YouTube Analytics MCP server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
