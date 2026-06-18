import cron from 'node-cron';
import pLimit from 'p-limit';
import { db } from '../database/connection';
import { MonitoringService } from '../services/monitoringService';

const monitoringService = new MonitoringService();

export function startMonitoringJob() {
  const cronExpression = process.env.MONITOR_CRON || '*/5 * * * *';
  const concurrency = parseInt(process.env.CHECK_CONCURRENCY || '3', 10);
  
  console.log(`🕒 Initializing monitoring job with cron "${cronExpression}" and concurrency ${concurrency}`);

  cron.schedule(cronExpression, async () => {
    console.log('[MonitoringJob] Starting applications check cycle...');
    
    try {
      const result = await db.query(
        "SELECT * FROM ap_applications WHERE monitoring_enabled = true AND current_status != 'maintenance'"
      );
      
      const apps = result.rows;
      if (apps.length === 0) {
        console.log('[MonitoringJob] No apps to check right now.');
        return;
      }

      console.log(`[MonitoringJob] Found ${apps.length} active apps to check.`);
      
      const limit = pLimit(concurrency);

      const tasks = apps.map((app) => 
        limit(async () => {
          try {
            await monitoringService.checkApplication(app);
            console.log(`[MonitoringJob] Checked ${app.name} (${app.url})`);
          } catch (error) {
            console.error(`[MonitoringJob] Error checking ${app.name}:`, error);
          }
        })
      );

      await Promise.all(tasks);
      console.log('[MonitoringJob] Finished check cycle.');

    } catch (error) {
      console.error('[MonitoringJob] Error fetching apps to check:', error);
    }
  });
}