import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";

// Local development entry point only.
// On Vercel, api/index.js imports app.js directly instead (no app.listen needed).
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`MHS Store API listening on port ${PORT}`));
