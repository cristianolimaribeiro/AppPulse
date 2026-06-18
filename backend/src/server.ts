import dotenv from 'dotenv';
dotenv.config();

import { app } from './app';
import { startMonitoringJob } from './jobs/monitoringJob';
import { db } from './database/connection';

const PORT = process.env.PORT || 10000;

async function startServer() {
  try {
    // Test database connection
    const result = await db.query('SELECT NOW()');
    console.log('✅ Database connected:', result.rows[0].now);

    // Start Express server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

    // Start background jobs
    startMonitoringJob();
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();