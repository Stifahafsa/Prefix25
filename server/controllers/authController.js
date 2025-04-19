import Utilisateur from "../models/utilisateur.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { nom, email, password } = req.body;
  try {
    const utilisateurExiste = await Utilisateur.findOne({ where: { email } });
    if (utilisateurExiste) {
      return res.status(400).json({ message: "L'email existe déjà." });
    }
    const hash = await bcrypt.hash(password, 10);
    const utilisateur = await Utilisateur.create({
      nom,
      email,
      password: hash,
    });
    res.status(201).json({ message: "Utilisateur créé avec succès." });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur." });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const utilisateur = await Utilisateur.findOne({ where: { email } });
    if (!utilisateur) {
      return res
        .status(400)
        .json({ message: "Email ou mot de passe incorrect." });
    }
    const isMatch = await bcrypt.compare(password, utilisateur.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Email ou mot de passe incorrect." });
    }
    const token = jwt.sign(
      { id: utilisateur.id, role: utilisateur.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Set HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.json({
      token,
      utilisateur: {
        id: utilisateur.id,
        nom: utilisateur.nom,
        email: utilisateur.email,
        role: utilisateur.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Déconnexion réussie" });
};
