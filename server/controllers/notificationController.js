import Notification from "../models/notification.js";

// Créer une notification
export const createNotification = async (req, res) => {
  try {
    const { utilisateurId, message } = req.body;

    const notification = await Notification.create({
      utilisateurId,
      message,
    });

    res.status(201).json(notification);
  } catch (error) {
    console.error("Erreur création notification:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Récupérer toutes les notifications (option: seulement non lues)
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.json(notifications);
  } catch (error) {
    console.error("Erreur récupération notifications:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Marquer une notification comme lue
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findByPk(id);
    if (!notification) {
      return res.status(404).json({ message: "Notification non trouvée" });
    }

    notification.is_read = true;
    await notification.save();

    res.json({ message: "Notification marquée comme lue", notification });
  } catch (error) {
    console.error("Erreur maj notification:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
