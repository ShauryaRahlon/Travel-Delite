import { Router } from "express";
import { createBooking } from "./booking.controller.js";

const router = Router();

router.post("/", createBooking);

export default router;
