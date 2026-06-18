import { db } from '../database/connection';

export class DashboardService {
  async getDashboardData() {
    const appsResult = await db.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE current_status = 'online') as online,
        COUNT(*) FILTER (WHERE current_status = 'degraded') as degraded,
        COUNT(*) FILTER (WHERE current_status = 'offline') as offline,
        COUNT(*) FILTER (WHERE current_status = 'maintenance') as maintenance,
        COUNT(*) FILTER (WHERE current_status = 'unknown') as unknown
      FROM ap_applications
    `);

    const incidentsResult = await db.query(`
      SELECT COUNT(*) as open_incidents
      FROM ap_incidents
      WHERE status != 'resolved'
    `);

    const envsResult = await db.query(`
      SELECT environment, COUNT(*) as count
      FROM ap_applications
      GROUP BY environment
    `);

    const avgResponseResult = await db.query(`
      SELECT AVG(response_time_ms) as avg_time
      FROM ap_checks
      WHERE status IN ('online', 'degraded') AND checked_at > NOW() - INTERVAL '24 hours'
    `);

    const recentIncidentsResult = await db.query(`
      SELECT i.id, i.title, i.status, i.severity, i.started_at, a.name as application_name
      FROM ap_incidents i
      JOIN ap_applications a ON i.application_id = a.id
      ORDER BY i.id DESC
      LIMIT 5
    `);

    const latestChecksResult = await db.query(`
      SELECT c.id, c.status, c.http_status_code, c.response_time_ms, c.checked_at, a.name as application_name
      FROM ap_checks c
      JOIN ap_applications a ON c.application_id = a.id
      ORDER BY c.id DESC
      LIMIT 10
    `);

    return {
      applications: appsResult.rows[0],
      incidents: {
        open: parseInt(incidentsResult.rows[0].open_incidents, 10)
      },
      environments: envsResult.rows,
      average_response_time_ms: avgResponseResult.rows[0].avg_time ? Math.round(parseFloat(avgResponseResult.rows[0].avg_time)) : 0,
      recent_incidents: recentIncidentsResult.rows,
      latest_checks: latestChecksResult.rows
    };
  }
}