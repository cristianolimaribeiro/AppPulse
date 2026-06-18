import { Request, Response, NextFunction } from 'express';
import { IncidentService } from '../services/incidentService';
import { AuthRequest } from '../middlewares/authMiddleware';

export class IncidentController {
  private incidentService = new IncidentService();

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const incidents = await this.incidentService.list();
      res.json(incidents);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const incident = await this.incidentService.getById(Number(id));
      res.json(incident);
    } catch (error) {
      next(error);
    }
  };

  create = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) throw new Error('Não autenticado');
      
      const { application_id, title, description } = req.body;
      if (!application_id || !title || !description) {
        res.status(400).json({ error: 'Aplicação, título e descrição são obrigatórios' });
        return;
      }
      const incident = await this.incidentService.create(req.body, req.user.id);
      res.status(201).json(incident);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { title, description, severity, status } = req.body;
      if (!title || !description || !severity || !status) {
        res.status(400).json({ error: 'Todos os campos são obrigatórios' });
        return;
      }
      const incident = await this.incidentService.update(Number(id), req.body);
      res.json(incident);
    } catch (error) {
      next(error);
    }
  };

  resolve = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const incident = await this.incidentService.resolve(Number(id));
      res.json(incident);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.incidentService.delete(Number(id));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}