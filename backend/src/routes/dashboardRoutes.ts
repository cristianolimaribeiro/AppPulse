import { Router } from 'express';
import { DashboardController } from '../controllers/dashboardController';
import { authenticate } from '../middlewares/authMiddleware';

const dashboardRoutes = Router();
const dashboardController = new DashboardController();

dashboardRoutes.use(authenticate);

// Any authenticated user can see the dashboard
dashboardRoutes.get('/', dashboardController.getDashboard);

export { dashboardRoutes };