import express from "express";
import { getDashboardStats, getReportsData , getSummaryData } from "../controllers/dashboardContoller.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Apply authentication middleware to all dashboard routes
router.use(verifyToken);

// Dashboard stats route
router.get("/stats", getDashboardStats);

// Reports data route
router.get("/reports", getReportsData);
router.get("/summary", getSummaryData);

export default router;