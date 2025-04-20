// This is a suggested file for the missing admin routes

import express from "express"
import { getAdmins, getAdminById, createAdmin, updateAdmin, deleteAdmin } from "../controllers/adminController.js"
import { verifyToken, isSuperAdmin } from "../middlewares/authMiddleware.js"

const router = express.Router()

// All admin routes require authentication and super admin privileges
router.use(verifyToken, isSuperAdmin)

// Admin management routes
router.get("/", getAdmins)
router.get("/:id", getAdminById)
router.post("/", createAdmin)
router.put("/:id", updateAdmin)
router.delete("/:id", deleteAdmin)

export default router
