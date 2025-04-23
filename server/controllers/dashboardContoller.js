import Evenement from "../models/evenement.js"
import Reservation from "../models/reservation.js"
import Utilisateur from "../models/utilisateur.js"
import Commentaire from "../models/commentaire.js"
import Espace from "../models/espace.js"
import { Op, fn, col, literal } from "sequelize"

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    const reservationsCount = await Reservation.count()
    const eventsCount = await Evenement.count()
    const talentsCount = await Utilisateur.count({
      where: { is_talent: true },
    })
    const commentsCount = await Commentaire.count()

    res.json({
      reservations: reservationsCount,
      events: eventsCount,
      talents: talentsCount,
      reports: commentsCount,
    })
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    res.status(500).json({ message: "Erreur lors de la récupération des statistiques" })
  }
}

// Get reports data
// Endpoint centralisé pour les rapports
export const getReportsData = async (req, res) => {
  try {
    const { chart, group } = req.query

    if (chart === "users") {
      // Nombre d'utilisateurs, admins, talents
      const total = await Utilisateur.count();
      const admins = await Utilisateur.count({ where: { role: "admin" } });
      const talents = await Utilisateur.count({ where: { is_talent: true } });
      return res.json({
        labels: ["Utilisateurs", "Admins", "Talents"],
        values: [total - admins - talents, admins, talents]
      });
    }

    if (chart === "espaces") {
      // Nombre d'espaces et d'ateliers
      const espaces = await Espace.count();
      // const ateliers = Atelier ? await Atelier.count() : 0;
      return res.json({
        labels: ["Espaces"],
        values: [espaces]
      });
    }

    if (chart === "reservations" && group) {
      // Réservations par mois ou jour
      let groupBy, dateFormat;
      if (group === "month") {
        groupBy = [fn("DATE_TRUNC", "month", col("date"))];
        dateFormat = "%Y-%m";
      } else if (group === "day") {
        groupBy = [fn("DATE", col("date"))];
        dateFormat = "%Y-%m-%d";
      }
      const reservations = await Reservation.findAll({
        attributes: [
          [fn("DATE_FORMAT", col("date"), dateFormat), "label"],
          [fn("COUNT", col("id")), "value"]
        ],
        group: ["label"],
        order: [[literal("label"), "ASC"]]
      });
      return res.json(reservations.map(r => r.dataValues));
    }

    if (chart === "evenements" && group) {
      // Événements par mois ou jour
      let groupBy, dateFormat;
      if (group === "month") {
        groupBy = [fn("DATE_TRUNC", "month", col("date"))];
        dateFormat = "%Y-%m";
      } else if (group === "day") {
        groupBy = [fn("DATE", col("date"))];
        dateFormat = "%Y-%m-%d";
      }
      const evenements = await Evenement.findAll({
        attributes: [
          [fn("DATE_FORMAT", col("date"), dateFormat), "label"],
          [fn("COUNT", col("id")), "value"]
        ],
        group: ["label"],
        order: [[literal("label"), "ASC"]]
      });
      return res.json(evenements.map(e => e.dataValues));
    }

    return res.status(400).json({ message: "Paramètres invalides" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};
