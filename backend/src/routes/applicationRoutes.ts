import { Router } from 'express';
import { ApplicationController } from '../controllers/applicationController';
import { authenticate } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/roleMiddleware';

const applicationRoutes = Router();
const applicationController = new ApplicationController();

applicationRoutes.use(authenticate);

// Operator and Admin routes
applicationRoutes.post('/', requireRole(['admin', 'operator']), applicationController.create);
applicationRoutes.put('/:id', requireRole(['admin', 'operator']), applicationController.update);
applicationRoutes.patch('/:id/toggle-monitoring', requireRole(['admin', 'operator']), applicationController.toggleMonitoring);
applicationRoutes.patch('/:id/maintenance', requireRole(['admin', 'operator']), applicationController.setMaintenance);
applicationRoutes.post('/:id/check', requireRole(['admin', 'operator']), applicationController.triggerCheck);

// Admin only route
applicationRoutes.delete('/:id', requireRole(['admin']), applicationController.delete);

// Viewer, Operator, and Admin routes
applicationRoutes.get('/', applicationController.list);
applicationRoutes.get('/:id', applicationController.getById);
applicationRoutes.get('/:id/checks', applicationController.getChecks);
applicationRoutes.get('/:id/status-history', applicationController.getStatusHistory);

export { applicationRoutes };