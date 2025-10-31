import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import experienceRoutes from "./features/experiences/experience.routes.js";
import promoRoutes from "./features/promo/promo.routes.js";
import bookingRoutes from "./Bookings/booking.routes.js";

// Load environment variables
dotenv.config();

export const app = express();

// CORS Configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : [
      "http://localhost:3000", // React default port
      "http://localhost:3001", // Alternative React port
      "http://localhost:5173", // Vite default port
      "http://localhost:4200", // Angular default port
      "http://localhost:8080", // Vue.js default port
      "http://127.0.0.1:3000", // Alternative localhost format
      "http://127.0.0.1:5173", // Alternative localhost format
    ];

const corsOptions = {
  origin:
    process.env.NODE_ENV === "development"
      ? true // Allow all origins in development
      : (
          origin: string | undefined,
          callback: (err: Error | null, allow?: boolean) => void
        ) => {
          // Allow requests with no origin (like mobile apps or curl requests)
          if (!origin) return callback(null, true);

          if (allowedOrigins.includes(origin)) {
            callback(null, true);
          } else {
            console.log(`CORS blocked origin: ${origin}`);
            callback(new Error("Not allowed by CORS"));
          }
        },
  credentials: true, // Allow cookies and authentication headers
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the Booklt API! 👋");
});

// Register API routes
app.use("/api/experiences", experienceRoutes);
app.use("/api/promo", promoRoutes);
app.use("/api/bookings", bookingRoutes);
