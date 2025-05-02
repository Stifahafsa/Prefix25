// import User from '../models/Talent.js';
// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import multer from 'multer';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Configuration de multer pour le stockage des fichiers
// const storage = multer.diskStorage({
//   destination: function(req, file, cb) {
//     const uploadDir = path.join(__dirname, '../public/uploads');
    
//     // Créer le répertoire s'il n'existe pas
//     if (!fs.existsSync(uploadDir)) {
//       fs.mkdirSync(uploadDir, { recursive: true });
//     }
    
//     cb(null, uploadDir);
//   },
//   filename: function(req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     const ext = path.extname(file.originalname);
//     cb(null, file.fieldname + '-' + uniqueSuffix + ext);
//   }
// });

// // Filtre pour les types de fichiers acceptés
// const fileFilter = (req, file, cb) => {
//   if (file.fieldname === 'image_profil') {
//     if (file.mimetype.startsWith('image/')) {
//       cb(null, true);
//     } else {
//       cb(new Error('Le fichier doit être une image'), false);
//     }
//   } else if (file.fieldname === 'cv') {
//     if (
//       file.mimetype === 'application/pdf' ||
//       file.mimetype === 'application/msword' ||
//       file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
//     ) {
//       cb(null, true);
//     } else {
//       cb(new Error('Le fichier CV doit être au format PDF ou DOC/DOCX'), false);
//     }
//   } else {
//     cb(null, true);
//   }
// };

// export const upload = multer({ 
//   storage: storage,
//   fileFilter: fileFilter,
//   limits: {
//     fileSize: 5 * 1024 * 1024 // 5MB max
//   }
// });


// // Obtenir le profil du talent
// export const getTalentProfile = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     console.log("Recherche du profil talent pour l'utilisateur ID:", userId);
    
//     const user = await User.findByPk(userId);
    
//     if (!user) {
//       console.log("Utilisateur non trouvé avec l'ID:", userId);
//       return res.status(404).json({ message: 'Utilisateur non trouvé' });
//     }
    
//     // Vérifier si l'utilisateur est un talent
//     if (!user.is_talent) {
//       console.log("L'utilisateur n'est pas un talent:", userId);
//       return res.status(403).json({ 
//         message: 'Cet utilisateur n\'est pas enregistré comme talent',
//         user: {
//           id: user.id,
//           nom: user.nom,
//           email: user.email,
//           is_talent: user.is_talent
//         }
//       });
//     }
    
//     // Masquer le mot de passe dans la réponse
//     const userResponse = user.toJSON();
//     delete userResponse.password;
    
//     console.log("Profil talent trouvé et renvoyé avec succès");
//     res.status(200).json(userResponse);
//   } catch (error) {
//     console.error('Erreur lors de la récupération du profil:', error);
//     res.status(500).json({ 
//       message: 'Erreur serveur lors de la récupération du profil',
//       error: error.message 
//     });
//   }
// };

// // Mettre à jour le profil du talent
// export const updateTalentProfile = async (req, res) => {
//   try {
//     const userId = req.user.id;
    
//     // Vérifier si l'utilisateur existe
//     const user = await User.findByPk(userId);
//     if (!user) {
//       return res.status(404).json({ message: 'Utilisateur non trouvé' });
//     }
    
//     // Préparer les données à mettre à jour
//     const updateData = {
//       nom: req.body.nom,
//       email: req.body.email,
//       telephone: req.body.telephone,
//       adresse: req.body.adresse,
//       domaine_artiste: req.body.domaine_artiste,
//       description_talent: req.body.description_talent,
//       specialite: req.body.specialite,
//       annees_experience: req.body.annees_experience,
//       competences: req.body.competences,
//       disponibilites: req.body.disponibilites
//     };
    
//     // Traiter les réseaux sociaux (JSON)
//     if (req.body.reseaux_sociaux) {
//       try {
//         updateData.reseaux_sociaux = typeof req.body.reseaux_sociaux === 'string' 
//           ? JSON.parse(req.body.reseaux_sociaux) 
//           : req.body.reseaux_sociaux;
//       } catch (e) {
//         console.error('Erreur lors du parsing des réseaux sociaux:', e);
//       }
//     }
    
//     // Traiter l'expérience (JSON)
//     if (req.body.experience) {
//       try {
//         updateData.experience = typeof req.body.experience === 'string' 
//           ? JSON.parse(req.body.experience) 
//           : req.body.experience;
//       } catch (e) {
//         console.error('Erreur lors du parsing de l\'expérience:', e);
//       }
//     }
    
//     // Traiter les fichiers uploadés
//     if (req.files) {
//       // Traiter l'image de profil
//       if (req.files.image_profil && req.files.image_profil[0]) {
//         // Supprimer l'ancienne image si elle existe
//         if (user.image_profil) {
//           const oldImagePath = path.join(__dirname, '../public', user.image_profil);
//           if (fs.existsSync(oldImagePath)) {
//             fs.unlinkSync(oldImagePath);
//           }
//         }
        
//         // Enregistrer le chemin de la nouvelle image
//         updateData.image_profil = '/uploads/' + req.files.image_profil[0].filename;
//       }
      
//       // Traiter le CV
//       if (req.files.cv && req.files.cv[0]) {
//         // Supprimer l'ancien CV s'il existe
//         if (user.cv) {
//           const oldCvPath = path.join(__dirname, '../public', user.cv);
//           if (fs.existsSync(oldCvPath)) {
//             fs.unlinkSync(oldCvPath);
//           }
//         }
        
//         // Enregistrer le chemin du nouveau CV
//         updateData.cv = '/uploads/' + req.files.cv[0].filename;
//       }
//     }
    
//     // Mettre à jour l'utilisateur
//     await user.update(updateData);
    
//     // Récupérer l'utilisateur mis à jour
//     const updatedUser = await User.findByPk(userId);
//     const userResponse = updatedUser.toJSON();
//     delete userResponse.password;
    
//     res.status(200).json({ 
//       message: 'Profil mis à jour avec succès', 
//       talent: userResponse 
//     });
//   } catch (error) {
//     console.error('Erreur lors de la mise à jour du profil:', error);
//     res.status(500).json({ message: 'Erreur serveur lors de la mise à jour du profil' });
//   }
// };

// // Mettre à jour le mot de passe
// export const updatePassword = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { currentPassword, newPassword } = req.body;
    
//     // Vérifier si l'utilisateur existe
//     const user = await User.findByPk(userId);
//     if (!user) {
//       return res.status(404).json({ message: 'Utilisateur non trouvé' });
//     }
    
//     // Vérifier si le mot de passe actuel est correct
//     const isPasswordValid = await user.checkPassword(currentPassword);
//     if (!isPasswordValid) {
//       return res.status(401).json({ message: 'Mot de passe actuel incorrect' });
//     }
    
//     // Mettre à jour le mot de passe
//     await user.update({ password: newPassword });
    
//     res.status(200).json({ message: 'Mot de passe mis à jour avec succès' });
//   } catch (error) {
//     console.error('Erreur lors de la mise à jour du mot de passe:', error);
//     res.status(500).json({ message: 'Erreur serveur lors de la mise à jour du mot de passe' });
//   }
// };

// // Service pour les opérations liées au talent
// export const talentService = {
//   // Récupérer le profil du talent
//   getProfile: async (userId) => {
//     try {
//       const user = await User.findByPk(userId);
//       if (!user) throw new Error('Utilisateur non trouvé');
      
//       const userResponse = user.toJSON();
//       delete userResponse.password;
      
//       return userResponse;
//     } catch (error) {
//       throw error;
//     }
//   },
  
//   // Mettre à jour le profil du talent
//   updateProfile: async (userId, updateData, files = null) => {
//     try {
//       const user = await User.findByPk(userId);
//       if (!user) throw new Error('Utilisateur non trouvé');
      
//       // Traiter les fichiers si présents
//       if (files) {
//         if (files.image_profil) {
//           updateData.image_profil = '/uploads/' + files.image_profil[0].filename;
//         }
//         if (files.cv) {
//           updateData.cv = '/uploads/' + files.cv[0].filename;
//         }
//       }
      
//       await user.update(updateData);
      
//       const updatedUser = await User.findByPk(userId);
//       const userResponse = updatedUser.toJSON();
//       delete userResponse.password;
      
//       return { message: 'Profil mis à jour avec succès', talent: userResponse };
//     } catch (error) {
//       throw error;
//     }
//   },
  
//   // Mettre à jour le mot de passe
//   updatePassword: async (userId, currentPassword, newPassword) => {
//     try {
//       const user = await User.findByPk(userId);
//       if (!user) throw new Error('Utilisateur non trouvé');
      
//       const isPasswordValid = await user.checkPassword(currentPassword);
//       if (!isPasswordValid) throw new Error('Mot de passe actuel incorrect');
      
//       await user.update({ password: newPassword });
      
//       return { message: 'Mot de passe mis à jour avec succès' };
//     } catch (error) {
//       throw error;
//     }
//   }
// };

// export default {
//   getTalentProfile,
//   updateTalentProfile,
//   updatePassword,
//   upload,
//   talentService
// };