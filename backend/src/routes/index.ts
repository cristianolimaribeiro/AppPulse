import { Router } from 'express';
import { authRoutes } from './authRoutes';
import { userRoutes } from './userRoutes';
import { applicationRoutes } from './applicationRoutes';
import { incidentRoutes } from './incidentRoutes';
import { dashboardRoutes } from './dashboardRoutes';

const routes = Router();

// Health check endpoint
routes.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

routes.use('/auth', authRoutes);
routes.use('/users', userRoutes);
routes.use('/applications', applicationRoutes);
routes.use('/incidents', incidentRoutes);
routes.use('/dashboard', dashboardRoutes);

export { routes };