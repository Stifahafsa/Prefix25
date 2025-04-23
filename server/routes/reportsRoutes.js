import express from "express";
import { getReportsData } from "../controllers/dashboardContoller.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Apply authentication middleware to all reports routes
router.use(verifyToken);

// Get reports data
router.get("/", getReportsData);

export default router;