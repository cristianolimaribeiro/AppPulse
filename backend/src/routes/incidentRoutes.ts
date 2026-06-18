import { Router } from 'express';
import { IncidentController } from '../controllers/incidentController';
import { authenticate } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/roleMiddleware';

const incidentRoutes = Router();
const incidentController = new IncidentController();

incidentRoutes.use(authenticate);

// Operator and Admin routes
incidentRoutes.post('/', requireRole(['admin', 'operator']), incidentController.create);
incidentRoutes.put('/:id', requireRole(['admin', 'operator']), incidentController.update);
incidentRoutes.patch('/:id/resolve', requireRole(['admin', 'operator']), incidentController.resolve);

// Admin only routes
incidentRoutes.delete('/:id', requireRole(['admin']), incidentController.delete);

// Viewer, Operator, and Admin routes
incidentRoutes.get('/', incidentController.list);
incidentRoutes.get('/:id', incidentController.getById);

export { incidentRoutes };