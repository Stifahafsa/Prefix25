import Evenement from "../models/evenement.js";
import Reservation from "../models/reservation.js";
import Utilisateur from "../models/utilisateur.js";
import Commentaire from "../models/commentaire.js";
import Espace from "../models/espace.js";
import { Op, fn, col, literal } from "sequelize";

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    // Counts
    const [reservationsCount, eventsCount, talentsCount, usersCount, commentsCount, spacesCount] = 
      await Promise.all([
        Reservation.count(),
        Evenement.count(),
        Utilisateur.count({ where: { is_talent: true } }),
        Utilisateur.count(),
        Commentaire.count(),
        Espace.count()
      ]);

    // Event status counts
    const [plannedEvents, confirmedEvents, cancelledEvents] = await Promise.all([
      Evenement.count({ where: { status: "planifié" } }),
      Evenement.count({ where: { status: "confirmé" } }),
      Evenement.count({ where: { status: "annulé" } })
    ]);

    // Occupancy rate (average of all events)
    const avgOccupancyResult = await Evenement.findOne({
      attributes: [[fn('AVG', col('taux_occupation')), 'avgOccupancy']],
      raw: true
    });

    const avgOccupancy = avgOccupancyResult ? Math.round(avgOccupancyResult.avgOccupancy) : 0;

    res.json({
      reservations: reservationsCount,
      events: eventsCount,
      talents: talentsCount,
      users: usersCount,
      comments: commentsCount,
      spaces: spacesCount,
      plannedEvents,
      confirmedEvents,
      cancelledEvents,
      avgOccupancy
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ 
      message: "Erreur lors de la récupération des statistiques",
      error: error.message 
    });
  }
};

// Get reports data
export const getReportsData = async (req, res) => {
  try {
    const { timeframe, chart } = req.query;

    // Handle different chart types
    if (chart === "users") {
      const [totalUsers, admins, superAdmins, talents] = await Promise.all([
        Utilisateur.count(),
        Utilisateur.count({ where: { role: "admin" } }),
        Utilisateur.count({ where: { role: "superadmin" } }),
        Utilisateur.count({ where: { is_talent: true } })
      ]);

      const regularUsers = totalUsers - admins - superAdmins - talents;

      return res.json({
        labels: ["Utilisateurs", "Admins", "Super Admins", "Talents"],
        values: [regularUsers, admins, superAdmins, talents],
      });
    }

    // Handle time-based reports
    let dateFormat;
    switch (timeframe) {
      case "month":
        dateFormat = "%Y-%m";
        break;
      case "quarter":
        dateFormat = "Q %Y";
        break;
      case "year":
        dateFormat = "%Y";
        break;
      default:
        dateFormat = "%Y-%m";
    }

    // Get data for each metric
    const [reservations, events, users] = await Promise.all([
      Reservation.findAll({
        attributes: [
          [fn("DATE_FORMAT", col("createdAt"), dateFormat), "label"],,
          [fn("COUNT", col("id")), "value"]
        ],
        group: ["label"],
        order: [[col("label"), "ASC"]],
        raw: true
      }),
      Evenement.findAll({
        attributes: [
          [fn("DATE_FORMAT", col("date"), dateFormat), "label"],
          [fn("COUNT", col("id")), "value"]
        ],
        group: ["label"],
        order: [[col("label"), "ASC"]],
        raw: true
      }),
      Utilisateur.findAll({
        attributes: [
          [fn("DATE_FORMAT", col("createdAt"), dateFormat), "label"],
          [fn("COUNT", col("id")), "value"]
        ],
        group: ["label"],
        order: [[col("label"), "ASC"]],
        raw: true
      })
    ]);

    res.json({
      reservations: reservations.map(r => ({ label: r.label, value: r.value })),
      events: events.map(e => ({ label: e.label, value: e.value })),
      users: users.map(u => ({ label: u.label, value: u.value }))
    });
  } catch (error) {
    console.error("Error fetching reports data:", error);
    res.status(500).json({ 
      message: "Erreur lors de la récupération des rapports",
      error: error.message 
    });
  }
};