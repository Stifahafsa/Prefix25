// import User from '../models/Talent.js';
// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Service pour les opérations liées au talent
// const talentService = {
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
//   updateProfile: async (formData) => {
//     try {
//       const userId = formData.get('userId') || formData.userId;
      
//       const user = await User.findByPk(userId);
//       if (!user) throw new Error('Utilisateur non trouvé');
      
//       // Préparer les données à mettre à jour
//       const updateData = {
//         nom: formData.get('nom') || formData.nom,
//         email: formData.get('email') || formData.email,
//         telephone: formData.get('telephone') || formData.telephone,
//         adresse: formData.get('adresse') || formData.adresse,
//         domaine_artiste: formData.get('domaine_artiste') || formData.domaine_artiste,
//         description_talent: formData.get('description_talent') || formData.description_talent,
//         specialite: formData.get('specialite') || formData.specialite,
//         annees_experience: formData.get('annees_experience') || formData.annees_experience,
//         competences: formData.get('competences') || formData.competences,
//         disponibilites: formData.get('disponibilites') || formData.disponibilites
//       };
      
//       // Traiter les réseaux sociaux (JSON)
//       const reseauxSociaux = formData.get('reseaux_sociaux') || formData.reseaux_sociaux;
//       if (reseauxSociaux) {
//         try {
//           updateData.reseaux_sociaux = typeof reseauxSociaux === 'string' 
//             ? JSON.parse(reseauxSociaux) 
//             : reseauxSociaux;
//         } catch (e) {
//           console.error('Erreur lors du parsing des réseaux sociaux:', e);
//         }
//       }
      
//       // Traiter l'expérience (JSON)
//       const experience = formData.get('experience') || formData.experience;
//       if (experience) {
//         try {
//           updateData.experience = typeof experience === 'string' 
//             ? JSON.parse(experience) 
//             : experience;
//         } catch (e) {
//           console.error('Erreur lors du parsing de l\'expérience:', e);
//         }
//       }
      
//       // Traiter l'image de profil
//       const imageProfilFile = formData.get('image_profil') || formData.image_profil;
//       if (imageProfilFile && imageProfilFile instanceof File) {
//         // Générer un nom de fichier unique
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//         const ext = path.extname(imageProfilFile.name);
//         const filename = 'image_profil-' + uniqueSuffix + ext;
        
//         // Créer le répertoire d'upload s'il n'existe pas
//         const uploadDir = path.join(__dirname, '../public/uploads');
//         if (!fs.existsSync(uploadDir)) {
//           fs.mkdirSync(uploadDir, { recursive: true });
//         }
        
//         // Chemin complet du fichier
//         const filepath = path.join(uploadDir, filename);
        
//         // Lire le fichier et l'écrire dans le système de fichiers
//         const buffer = await imageProfilFile.arrayBuffer();
//         fs.writeFileSync(filepath, Buffer.from(buffer));
        
//         // Supprimer l'ancienne image si elle existe
//         if (user.image_profil) {
//           const oldImagePath = path.join(__dirname, '../public', user.image_profil);
//           if (fs.existsSync(oldImagePath)) {
//             fs.unlinkSync(oldImagePath);
//           }
//         }
        
//         // Mettre à jour le chemin de l'image dans la base de données
//         updateData.image_profil = '/uploads/' + filename;
//       }
      
//       // Traiter le CV
//       const cvFile = formData.get('cv') || formData.cv;
//       if (cvFile && cvFile instanceof File) {
//         // Générer un nom de fichier unique
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//         const ext = path.extname(cvFile.name);
//         const filename = 'cv-' + uniqueSuffix + ext;
        
//         // Créer le répertoire d'upload s'il n'existe pas
//         const uploadDir = path.join(__dirname, '../public/uploads');
//         if (!fs.existsSync(uploadDir)) {
//           fs.mkdirSync(uploadDir, { recursive: true });
//         }
        
//         // Chemin complet du fichier
//         const filepath = path.join(uploadDir, filename);
        
//         // Lire le fichier et l'écrire dans le système de fichiers
//         const buffer = await cvFile.arrayBuffer();
//         fs.writeFileSync(filepath, Buffer.from(buffer));
        
//         // Supprimer l'ancien CV s'il existe
//         if (user.cv) {
//           const oldCvPath = path.join(__dirname, '../public', user.cv);
//           if (fs.existsSync(oldCvPath)) {
//             fs.unlinkSync(oldCvPath);
//           }
//         }
        
//         // Mettre à jour le chemin du CV dans la base de données
//         updateData.cv = '/uploads/' + filename;
//       }
      
//       // Mettre à jour l'utilisateur
//       await user.update(updateData);
      
//       // Récupérer l'utilisateur mis à jour
//       const updatedUser = await User.findByPk(userId);
//       const userResponse = updatedUser.toJSON();
//       delete userResponse.password;
      
//       return { message: 'Profil mis à jour avec succès', talent: userResponse };
//     } catch (error) {
//       console.error('Erreur dans talentService.updateProfile:', error);
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

// export default talentService;