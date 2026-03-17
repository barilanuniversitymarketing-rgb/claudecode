#!/usr/bin/env node
/**
 * One-time script to obtain a refresh token for the YouTube Analytics API.
 *
 * Run: npx tsx src/get-token.ts
 *
 * Then open the URL, authorize the app, paste the code, and copy the
 * refresh_token into your .env file as YOUTUBE_REFRESH_TOKEN.
 */

import { google } from "googleapis";
import * as readline from "readline";

const SCOPES = [
  "https://www.googleapis.com/auth/youtube.readonly",
  "https://www.googleapis.com/auth/yt-analytics.readonly",
  "https://www.googleapis.com/auth/yt-analytics-monetary.readonly",
];

async function main() {
  const clientId = process.env.YOUTUBE_CLIENT_ID;
  const clientSecret = process.env.YOUTUBE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error(
      "Set YOUTUBE_CLIENT_ID and YOUTUBE_CLIENT_SECRET environment variables first."
    );
    process.exit(1);
  }

  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    "urn:ietf:wg:oauth:2.0:oob"
  );

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent",
  });

  console.log("\nAuthorize this app by visiting:\n");
  console.log(authUrl);
  console.log();

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const code = await new Promise<string>((resolve) => {
    rl.question("Enter the authorization code: ", (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });

  const { tokens } = await oauth2Client.getToken(code);
  console.log("\nTokens received:");
  console.log(JSON.stringify(tokens, null, 2));
  console.log(
    "\nAdd this to your .env file:\nYOUTUBE_REFRESH_TOKEN=" + tokens.refresh_token
  );
}

main().catch(console.error);
