/// backend/controllers/talentController.js
import sequelize from "../config/database.js";
import Utilisateur from "../models/utilisateur.js";
import bcrypt from "bcrypt";
import fs from "fs";

export const getTalentByEmail = async (req, res) => {
  try {
    console.log('Query params:', req.query); // Debug
    const { email } = req.query;
    
    if (!email) {
      return res.status(400).json({ 
        message: "Le paramètre email est requis dans l'URL : /api/talent?email=example@mail.com" 
      });
    }

    const talent = await Utilisateur.findOne({ 
      where: { 
        email: email,
        is_talent: true 
      }
    });
    
    if (!talent) {
      return res.status(404).json({ 
        message: `Aucun talent trouvé avec l'email ${email}` 
      });
    }
    
    res.json(talent);
  } catch (error) {
    console.error('Error fetching talent:', error);
    res.status(500).json({ 
      message: "Erreur serveur lors de la récupération du talent",
      error: error.message 
    });
  }
};

export const updateTalent = async (req, res) => {
  try {
    const { id } = req.params;
    let updates = { ...req.body };

    // AJOUTEZ ICI LES CONSOLE.LOG POUR DEBUG
    console.log('Données reçues:', {
      id,
      updates,
      files: req.files
    });

    // Validation spécifique pour le téléphone
    if (updates.telephone && !/^[0-9+\s-]{8,20}$/.test(updates.telephone)) {
      console.log('Validation téléphone échouée:', updates.telephone); // Ajouté
      return res.status(400).json({
        success: false,
        message: "Format de téléphone invalide"
      });
    }

    // Gestion des fichiers
    if (req.files?.image_profil) {
      updates.image_profil = `/uploads/${req.files.image_profil[0].filename}`;
    }
    if (req.files?.cv) {
      updates.cv = `/uploads/${req.files.cv[0].filename}`;
    }

    // Conversion des champs JSON
    if (updates.reseaux_sociaux && typeof updates.reseaux_sociaux === 'string') {
      updates.reseaux_sociaux = JSON.parse(updates.reseaux_sociaux);
    }
    if (updates.experience && typeof updates.experience === 'string') {
      updates.experience = JSON.parse(updates.experience);
    }

    // AJOUTEZ ICI AUSSI POUR VOIR LES DONNÉES AVANT MISE À JOUR
    console.log('Données avant mise à jour:', updates);

    const [updated] = await Utilisateur.update(updates, { 
      where: { id } 
    });
    console.log('Résultat de la mise à jour:', updated); // Ajouté

    if (!updated) {
      return res.status(404).json({ 
        success: false,
        message: "Talent non trouvé" 
      });
    }

    const updatedTalent = await Utilisateur.findByPk(id);
    res.json({
      success: true,
      message: 'Profil mis à jour avec succès',
      talent: updatedTalent
    });

  } catch (error) {
    console.error('Error in updateTalent:', error);
    // AJOUTEZ LE DÉTAIL DE L'ERREUR
    console.error('Détails erreur:', {
      message: error.message,
      stack: error.stack,
      ...error
    });
    
    // Nettoyage des fichiers en cas d'erreur
    if (req.files?.image_profil) {
      fs.unlinkSync(req.files.image_profil[0].path);
    }
    if (req.files?.cv) {
      fs.unlinkSync(req.files.cv[0].path);
    }

    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du profil'
    });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    const talent = await Utilisateur.findByPk(id);
    if (!talent) {
      return res.status(404).json({ message: "Talent non trouvé" });
    }

    // Vérifier le mot de passe actuel
    const isMatch = await bcrypt.compare(currentPassword, talent.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Mot de passe actuel incorrect" });
    }

    // Mettre à jour le mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await talent.update({ password: hashedPassword });

    res.json({ message: "Mot de passe mis à jour avec succès" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};