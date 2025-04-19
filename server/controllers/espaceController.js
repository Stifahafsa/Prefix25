import Espace from '../models/espace.js';

export const getEspaces = async (req, res) => {
  try {
    const espaces = await Espace.findAll();
    res.json(espaces);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createEspace = async (req, res) => {
  try {
    const espace = await Espace.create(req.body);
    res.status(201).json(espace);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateEspace = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Espace.update(req.body, { where: { id } });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteEspace = async (req, res) => {
  try {
    const { id } = req.params;
    await Espace.destroy({ where: { id } });
    res.json({ message: 'Espace deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};