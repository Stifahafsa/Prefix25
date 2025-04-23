import Evenement from "../models/evenement.js";
import Reservation from "../models/reservation.js";
import Utilisateur from "../models/utilisateur.js";
import Commentaire from "../models/commentaire.js";
import Espace from "../models/espace.js";
import { Op, fn, col, literal, Sequelize } from "sequelize";

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    // Counts
    const reservationsCount = await Reservation.count();
    const eventsCount = await Evenement.count();
    const talentsCount = await Utilisateur.count({
      where: { is_talent: true },
    });
    const usersCount = await Utilisateur.count();
    const commentsCount = await Commentaire.count();
    const spacesCount = await Espace.count();

    // Event status counts
    const plannedEvents = await Evenement.count({
      where: { status: "planifié" },
    });
    const confirmedEvents = await Evenement.count({
      where: { status: "confirmé" },
    });
    const cancelledEvents = await Evenement.count({
      where: { status: "annulé" },
    });

    // Occupancy rate (average of all events)
    const avgOccupancy = await Evenement.findOne({
      attributes: [
        [fn("AVG", col("taux_occupation")), "avgOccupancy"],
      ],
      raw: true,
    });

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
      avgOccupancy: avgOccupancy ? Math.round(avgOccupancy.avgOccupancy) : 0,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ message: "Erreur lors de la récupération des statistiques" });
  }
};

// Get reports data
export const getReportsData = async (req, res) => {
  try {
    const { timeframe, chart } = req.query;

    // Handle different chart types
    if (chart === "users") {
      const totalUsers = await Utilisateur.count();
      const admins = await Utilisateur.count({ where: { role: "admin" } });
      const superAdmins = await Utilisateur.count({ where: { role: "superadmin" } });
      const talents = await Utilisateur.count({ where: { is_talent: true } });
      const regularUsers = totalUsers - admins - superAdmins - talents;

      return res.json({
        labels: ["Utilisateurs", "Admins", "Super Admins", "Talents"],
        values: [regularUsers, admins, superAdmins, talents],
      });
    }

    // Handle time-based reports
    let groupBy, dateFormat, interval;
    switch (timeframe) {
      case "month":
        groupBy = [fn("DATE_TRUNC", "month", col("createdAt"))];
        dateFormat = "%Y-%m";
        interval = "1 month";
        break;
      case "quarter":
        groupBy = [fn("DATE_TRUNC", "quarter", col("createdAt"))];
        dateFormat = "Q %Y";
        interval = "3 months";
        break;
      case "year":
        groupBy = [fn("DATE_TRUNC", "year", col("createdAt"))];
        dateFormat = "%Y";
        interval = "1 year";
        break;
      default:
        groupBy = [fn("DATE_TRUNC", "month", col("createdAt"))];
        dateFormat = "%Y-%m";
        interval = "1 month";
    }

    // Get data for each metric
    const [reservations, events, users] = await Promise.all([
      Reservation.findAll({
        attributes: [
          [fn("DATE_FORMAT", col("createdAt"), dateFormat)], "label",
          [fn("COUNT", col("id")), "value"],
        ],
        group: ["label"],
        order: [[col("label"), "ASC"]],
      }),
      Evenement.findAll({
        attributes: [
          [fn("DATE_FORMAT", col("date"), dateFormat)], "label",
          [fn("COUNT", col("id")), "value"],
        ],
        group: ["label"],
        order: [[col("label"), "ASC"]],
      }),
      Utilisateur.findAll({
        attributes: [
          [fn("DATE_FORMAT", col("createdAt"), dateFormat)], "label",
          [fn("COUNT", col("id")), "value"],
        ],
        group: ["label"],
        order: [[col("label"), "ASC"]],
      }),
    ]);

    res.json({
      reservations: reservations.map(r => ({ label: r.label, value: r.value })),
      events: events.map(e => ({ label: e.label, value: e.value })),
      users: users.map(u => ({ label: u.label, value: u.value })),
    });
  } catch (error) {
    console.error("Error fetching reports data:", error);
    res.status(500).json({ message: "Erreur lors de la récupération des rapports" });
  }
};