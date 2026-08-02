import app from "../server/app.js";

// Vercel treats this default export as the serverless function handler.
// Express apps are valid (req, res) handlers, so we can export it directly.
export default app;
