import express from "express";
import {
  createNotification,
  getNotifications,
  markAsRead,
} from "../controllers/notificationController.js";
import { verifyToken, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Seuls Admin et SuperAdmin peuvent voir/créer les notifications
router.use(verifyToken, isAdmin);

// Créer une notification
router.post("/", createNotification);

// Récupérer toutes les notifications
router.get("/", getNotifications);

// Marquer une notification comme lue
router.put("/:id/read", markAsRead);

export default router;
