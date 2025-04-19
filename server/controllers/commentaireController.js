import Commentaire from '../models/commentaire.js';

export const getCommentaires = async (req, res) => {
  try {
    const commentaires = await Commentaire.findAll();
    res.json(commentaires);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createCommentaire = async (req, res) => {
  try {
    const commentaire = await Commentaire.create(req.body);
    res.status(201).json(commentaire);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateCommentaire = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Commentaire.update(req.body, { where: { id } });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteCommentaire = async (req, res) => {
  try {
    const { id } = req.params;
    await Commentaire.destroy({ where: { id } });
    res.json({ message: 'Commentaire deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};