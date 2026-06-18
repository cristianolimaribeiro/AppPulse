import { Request, Response, NextFunction } from 'express';
import { ApplicationService } from '../services/applicationService';

export class ApplicationController {
  private applicationService = new ApplicationService();

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const apps = await this.applicationService.list();
      res.json(apps);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const app = await this.applicationService.getById(Number(id));
      res.json(app);
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, url } = req.body;
      if (!name || !url) {
        res.status(400).json({ error: 'Nome e URL são obrigatórios' });
        return;
      }
      const app = await this.applicationService.create(req.body);
      res.status(201).json(app);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { name, url } = req.body;
      if (!name || !url) {
        res.status(400).json({ error: 'Nome e URL são obrigatórios' });
        return;
      }
      const app = await this.applicationService.update(Number(id), req.body);
      res.json(app);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.applicationService.delete(Number(id));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  toggleMonitoring = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { enabled } = req.body;
      if (enabled === undefined) {
        res.status(400).json({ error: 'Campo enabled é obrigatório' });
        return;
      }
      const app = await this.applicationService.toggleMonitoring(Number(id), enabled);
      res.json(app);
    } catch (error) {
      next(error);
    }
  };

  setMaintenance = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { maintenance } = req.body;
      if (maintenance === undefined) {
        res.status(400).json({ error: 'Campo maintenance é obrigatório' });
        return;
      }
      const app = await this.applicationService.setMaintenance(Number(id), maintenance);
      res.json(app);
    } catch (error) {
      next(error);
    }
  };

  triggerCheck = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const app = await this.applicationService.triggerCheck(Number(id));
      res.json(app);
    } catch (error) {
      next(error);
    }
  };

  getChecks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const checks = await this.applicationService.getChecks(Number(id));
      res.json(checks);
    } catch (error) {
      next(error);
    }
  };

  getStatusHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const history = await this.applicationService.getStatusHistory(Number(id));
      res.json(history);
    } catch (error) {
      next(error);
    }
  };
}