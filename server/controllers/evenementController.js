import Evenement from "../models/evenement.js";

export const getEvenements = async (req, res) => {
  try {
    const evenements = await Evenement.findAll();
    res.json(evenements);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const createEvenement = async (req, res) => {
  try {
    const evenement = await Evenement.create(req.body);
    res.status(201).json(evenement);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateEvenement = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Evenement.update(req.body, { where: { id } });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteEvenement = async (req, res) => {
  try {
    const { id } = req.params;
    await Evenement.destroy({ where: { id } });
    res.json({ message: "Evenement deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getEvenementById = async (req, res) => {
  try {
    const { id } = req.params;
    const evenement = await Evenement.findByPk(id);

    if (!evenement) {
      return res.status(404).json({ message: "Événement non trouvé" });
    }

    res.json(evenement);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};
