import Evenement from "../models/evenement.js"
import Reservation from "../models/reservation.js"
import Utilisateur from "../models/utilisateur.js"
import Commentaire from "../models/commentaire.js"

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
export const getReportsData = async (req, res) => {
  const { timeframe } = req.query

  try {
    let reportData = []

    // This is a simplified example - in a real application, you would query your database
    // based on the timeframe and aggregate the data accordingly

    if (timeframe === "month") {
      reportData = [
        { label: "Janvier", value: 12 },
        { label: "Février", value: 19 },
        { label: "Mars", value: 15 },
        { label: "Avril", value: 22 },
        { label: "Mai", value: 28 },
        { label: "Juin", value: 32 },
      ]
    } else if (timeframe === "quarter") {
      reportData = [
        { label: "Q1", value: 45 },
        { label: "Q2", value: 82 },
        { label: "Q3", value: 67 },
        { label: "Q4", value: 53 },
      ]
    } else {
      reportData = [
        { label: "2023", value: 156 },
        { label: "2024", value: 247 },
        { label: "2025", value: 189 },
      ]
    }

    res.json(reportData)
  } catch (error) {
    console.error("Error fetching reports data:", error)
    res.status(500).json({ message: "Erreur lors de la récupération des données de rapport" })
  }
}
