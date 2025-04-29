// server.js
import express from "express";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Basic route for health check
app.get("/health", (req, res) => {
  res.status(200).send("Server is up and running!");
});

// Placeholder for future routes (SMTP, SMS etc)

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
