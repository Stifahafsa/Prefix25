// This is a suggested file for the missing system logs routes

import express from "express"
import { getSystemLogs, getSystemLogById, clearSystemLogs } from "../controllers/logsController.js"
import { verifyToken, isSuperAdmin } from "../middlewares/authMiddleware.js"

const router = express.Router()

// All logs routes require authentication and super admin privileges
router.use(verifyToken, isSuperAdmin)

// System logs routes
router.get("/", getSystemLogs)
router.get("/:id", getSystemLogById)
router.delete("/", clearSystemLogs)

export default router
