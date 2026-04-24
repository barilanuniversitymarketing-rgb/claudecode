# YouTube Analytics MCP Server

An MCP (Model Context Protocol) server that provides tools for querying the YouTube Analytics API. Use it with Claude or any MCP-compatible client to analyze your YouTube channel's performance.

## Tools

| Tool | Description |
|------|-------------|
| `get_video_metrics` | Get analytics for specific videos (views, watch time, likes, etc.) |
| `list_channel_reports` | List channel-level reports with flexible dimensions and metrics |
| `query_custom_analytics` | Run fully custom YouTube Analytics queries |
| `get_top_videos` | Get top performing videos by views (includes video titles) |
| `get_audience_retention` | Get audience retention curve for a video |
| `get_channel_info` | Get channel info (subscribers, total views, video count) |
| `get_traffic_sources` | See which sources drive the most traffic |
| `get_demographics` | Get viewer age/gender breakdown |

## Setup

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **YouTube Analytics API** and **YouTube Data API v3**
4. Go to **APIs & Services → Credentials**
5. Create an **OAuth 2.0 Client ID** (type: Desktop app)
6. Download the credentials

### 2. Get a Refresh Token

```bash
# Install dependencies
npm install

# Set your credentials
export YOUTUBE_CLIENT_ID=your_client_id
export YOUTUBE_CLIENT_SECRET=your_client_secret

# Run the auth helper
npx tsx src/get-token.ts
```

Follow the URL printed, authorize the app, paste the code back, and copy the `refresh_token` value.

### 3. Configure Environment

Create a `.env` file (or set environment variables):

```env
YOUTUBE_CLIENT_ID=your_client_id
YOUTUBE_CLIENT_SECRET=your_client_secret
YOUTUBE_REFRESH_TOKEN=your_refresh_token
```

### 4. Build

```bash
npm run build
```

## Claude Desktop Configuration

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "youtube-analytics": {
      "command": "node",
      "args": ["/path/to/youtube-analytics-mcp/dist/index.js"],
      "env": {
        "YOUTUBE_CLIENT_ID": "your_client_id",
        "YOUTUBE_CLIENT_SECRET": "your_client_secret",
        "YOUTUBE_REFRESH_TOKEN": "your_refresh_token"
      }
    }
  }
}
```

## Claude Code Configuration

Add to your `.claude/settings.json`:

```json
{
  "mcpServers": {
    "youtube-analytics": {
      "command": "node",
      "args": ["/path/to/youtube-analytics-mcp/dist/index.js"],
      "env": {
        "YOUTUBE_CLIENT_ID": "your_client_id",
        "YOUTUBE_CLIENT_SECRET": "your_client_secret",
        "YOUTUBE_REFRESH_TOKEN": "your_refresh_token"
      }
    }
  }
}
```

## Example Usage

Once connected, you can ask Claude things like:

- *"What are my top 10 videos from the last 30 days?"*
- *"Show me the audience retention curve for video dQw4w9WgXcQ"*
- *"What are the traffic sources for my channel this month?"*
- *"Get views and watch time for videos abc123 and def456 in Q1 2025"*
- *"What's the demographic breakdown of my viewers?"*

## Development

```bash
# Run in development mode (no build needed)
npm run dev
```

## Required OAuth Scopes

- `https://www.googleapis.com/auth/youtube.readonly`
- `https://www.googleapis.com/auth/yt-analytics.readonly`
- `https://www.googleapis.com/auth/yt-analytics-monetary.readonly` (for revenue metrics)
