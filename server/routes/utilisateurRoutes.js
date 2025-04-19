import express from 'express';
import Utilisateur from '../models/utilisateur.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// GET /api/utilisateurs?is_talent=true
router.get('/', verifyToken, async (req, res) => {
  try {
    const where = {};
    if (req.query.is_talent === 'true') {
      where.is_talent = true;
    }
    const utilisateurs = await Utilisateur.findAll({ where });
    res.json(utilisateurs);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;