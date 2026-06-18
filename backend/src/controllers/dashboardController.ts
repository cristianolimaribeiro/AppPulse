import { Request, Response, NextFunction } from 'express';
import { DashboardService } from '../services/dashboardService';

export class DashboardController {
  private dashboardService = new DashboardService();

  getDashboard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.dashboardService.getDashboardData();
      res.json(data);
    } catch (error) {
      next(error);
    }
  };
}