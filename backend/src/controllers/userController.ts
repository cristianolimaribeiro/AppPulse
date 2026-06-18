import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/userService';

export class UserController {
  private userService = new UserService();

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const users = await this.userService.list();
      res.json(users);
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
        return;
      }
      const user = await this.userService.create(req.body);
      res.status(201).json(user);
    } catch (error: any) {
      if (error.code === '23505') { // unique violation
        res.status(400).json({ error: 'Email já cadastrado' });
        return;
      }
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { name, role } = req.body;
      if (!name || !role) {
        res.status(400).json({ error: 'Nome e role são obrigatórios' });
        return;
      }
      const user = await this.userService.update(Number(id), req.body);
      res.json(user);
    } catch (error) {
      next(error);
    }
  };

  toggleActive = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { active } = req.body;
      if (active === undefined) {
        res.status(400).json({ error: 'Campo active é obrigatório' });
        return;
      }
      const user = await this.userService.toggleActive(Number(id), active);
      res.json(user);
    } catch (error) {
      next(error);
    }
  };
}