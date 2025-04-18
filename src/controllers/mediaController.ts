// src/controllers/mediaController.ts
import type { NextFunction, Request, Response } from 'express';
import mediaDatamapper from '../datamappers/mediaDatamapper';

const mediaController = {
  // Affiche tous les médias
  async index(_req: Request, res: Response, _next: NextFunction): Promise<void> {
    const medias = await mediaDatamapper.getAllMedias();
    if (!medias) {
      res.status(404).json({ error: 'Médias introuvables.' });
      return;
    }
    res.json(medias);
  },

  // Affiche un média par son ID
  async show(req: Request, res: Response, _next: NextFunction): Promise<void> {
    const id = Number(req.params.id);
    if (!id) {
      res.status(400).json({ error: 'ID invalide.' });
      return;
    }

    const media = await mediaDatamapper.getMediaById(id);
    if (!media) {
      res.status(404).json({ error: 'Média introuvable.' });
      return;
    }

    res.json(media);
  },

  // Crée un nouveau média
  async store(req: Request, res: Response, _next: NextFunction): Promise<void> {
    const { title, type, description, label, recipeId, status } = req.body;

    if (!title || !type || typeof recipeId !== 'number') {
      res.status(400).json({ error: 'Les données du média sont invalides ou incomplètes.' });
      return;
    }

    const media = await mediaDatamapper.createMedia({
      title,
      type,
      description,
      label,
      recipeId,
      status,
    });

    if (!media) {
      res.status(500).json({ error: 'Échec de la création du média.' });
      return;
    }

    res.status(201).json({ message: 'Média créé avec succès !', media });
  },

  // Met à jour un média existant
  async update(req: Request, res: Response, _next: NextFunction): Promise<void> {
    const id = Number(req.params.id);
    if (!id) {
      res.status(400).json({ error: 'ID invalide.' });
      return;
    }

    const existing = await mediaDatamapper.getMediaById(id);
    if (!existing) {
      res.status(404).json({ error: 'Média introuvable.' });
      return;
    }

    const { title, type, description, label, recipeId, status } = req.body;
    const updated = await mediaDatamapper.updateMedia({
      id,
      title: title ?? existing.title,
      type: type ?? existing.type,
      description: description ?? existing.description,
      label: label ?? existing.label,
      recipeId: recipeId ?? existing.recipe_id,
      status: status ?? existing.status,
    });

    res.json({ message: 'Média mis à jour avec succès.', media: updated });
  },

  // Supprime (soft-delete) un média
  async destroy(req: Request, res: Response, _next: NextFunction): Promise<void> {
    const id = Number(req.params.id);
    if (!id) {
      res.status(400).json({ error: 'ID invalide.' });
      return;
    }

    const media = await mediaDatamapper.removeMedia(id);
    if (!media) {
      res.status(404).json({ error: 'Média introuvable ou déjà supprimé.' });
      return;
    }

    res.json({ message: 'Média supprimé avec succès.' });
  },
};

export default mediaController;
