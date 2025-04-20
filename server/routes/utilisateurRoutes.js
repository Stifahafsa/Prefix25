import express from "express";
import Utilisateur from "../models/utilisateur.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// GET /api/utilisateurs?is_talent=true
router.get("/", verifyToken, async (req, res) => {
  try {
    const where = {};
    if (req.query.is_talent === "true") {
      where.is_talent = true;
    }
    const utilisateurs = await Utilisateur.findAll({ where });
    res.json(utilisateurs);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/utilisateurs/:id
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const utilisateur = await Utilisateur.findByPk(req.params.id);
    if (!utilisateur) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.json(utilisateur);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/utilisateurs
// router.post('/', verifyToken, async (req, res) => {
//   try {
//     const { nom, email, domaine_artiste, statut_talent } = req.body;
//     if (!nom || !email || !domaine_artiste || !statut_talent) {
//       return res.status(400).json({ message: "Champs obligatoires manquants." });
//     }
//     const utilisateur = await Utilisateur.create(req.body);
//     res.status(201).json(utilisateur);
//   } catch (err) {
//     if (err.name === "SequelizeUniqueConstraintError") {
//       return res.status(400).json({ message: "Cet email existe déjà." });
//     }
//     console.error("Erreur lors de la création de l'utilisateur:", err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

router.post("/", verifyToken, async (req, res) => {
  try {
    // Permettre la création sans mot de passe pour les tests
    req.body.password = req.body.password || "tempPassword123";

    const utilisateur = await Utilisateur.create({
      ...req.body,
      is_talent: true,
      role: req.body.role || "utilisateur",
    });

    res.status(201).json(utilisateur);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Erreur serveur",
      error: err.message,
    });
  }
});

// PUT /api/utilisateurs/:id
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Utilisateur.update(req.body, { where: { id } });
    if (updated) {
      const updatedUser = await Utilisateur.findByPk(id);
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: "Utilisateur non trouvé" });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Add this DELETE route
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const utilisateur = await Utilisateur.findByPk(req.params.id);
    if (!utilisateur) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    await utilisateur.destroy();
    res.json({ message: "Utilisateur supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la suppression de l'utilisateur" });
  }
});

export default router;
