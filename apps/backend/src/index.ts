import http from "http";
import * as dotenv from "dotenv";
dotenv.config();

import app from "./app";
import connectDB from "./config/mongodb.config";

const isProduction = process.env.NODE_ENV === "production";
const PORT = process.env.APP_PORT || 3000;

// Connect to the database
connectDB().catch((err) => {
    console.error("Database connection error:", err);
    process.exit(1); // Exit if database connection fails
});

if (!isProduction) {
  // For development: Use `app.listen` directly
  app.listen(PORT, () => {
    console.log(`Server running in development mode on port ${PORT}`);
  });
} else {
  // For production: Use `http.createServer`
  const server = http.createServer(app);
  server.listen(PORT, () => {
    console.log(`Server running in production mode on port ${PORT}`);
  });
}
