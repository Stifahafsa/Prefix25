// This is a suggested file for the missing system configuration routes

import express from "express"
import { getSystemConfig, updateSystemConfig } from "../controllers/configController.js"
import { verifyToken, isSuperAdmin } from "../middlewares/authMiddleware.js"

const router = express.Router()

// All config routes require authentication and super admin privileges
router.use(verifyToken, isSuperAdmin)

// System configuration routes
router.get("/", getSystemConfig)
router.put("/", updateSystemConfig)

export default router
