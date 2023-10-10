const GOOGLE_CLIENT_ID =
  "599431370407-v5796hq8t7u2hnpqok7p2s7esk74dg6v.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";
const JWT_ACCESS_SECRET =
  process.env.JWT_ACCESS_SECRET || "some_jwt_access_secret";
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || "some_jwt_refresh_secret";

module.exports = {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
};
