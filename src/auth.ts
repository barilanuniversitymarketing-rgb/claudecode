import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";

export function createOAuth2Client(): OAuth2Client {
  const clientId = process.env.YOUTUBE_CLIENT_ID;
  const clientSecret = process.env.YOUTUBE_CLIENT_SECRET;
  const refreshToken = process.env.YOUTUBE_REFRESH_TOKEN;

  if (!clientId || !clientSecret) {
    throw new Error(
      "Missing required environment variables: YOUTUBE_CLIENT_ID and YOUTUBE_CLIENT_SECRET"
    );
  }

  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    "urn:ietf:wg:oauth:2.0:oob"
  );

  if (refreshToken) {
    oauth2Client.setCredentials({ refresh_token: refreshToken });
  } else {
    throw new Error(
      "Missing YOUTUBE_REFRESH_TOKEN. Run the auth flow to obtain a refresh token."
    );
  }

  return oauth2Client;
}
