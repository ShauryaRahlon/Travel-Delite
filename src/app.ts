import express from "express";
import cors from "cors";

// Import your routes
// import experienceRoutes from "./features/experiences/experience.routes";
import experienceRoutes from "./features/experiences/experience.routes.js";
// import promoRoutes from "./features/promo/promo.routes";
import bookingRoutes from "./features/experiences/experience.routes.js";

export const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the Booklt API! 👋");
});
// Register API routes
app.use("/api/experiences", experienceRoutes);
// app.use("/api/promo", promoRoutes);
app.use("/api/bookings", bookingRoutes);
