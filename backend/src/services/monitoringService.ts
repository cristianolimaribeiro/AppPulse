import { db } from '../database/connection';
import axios from 'axios';

export class MonitoringService {
  async checkApplication(app: any) {
    const startTime = Date.now();
    let status = 'unknown';
    let httpStatus = null;
    let responseTime = null;
    let errorMessage = null;

    try {
      const response = await axios.get(app.url, {
        timeout: app.timeout_ms,
        validateStatus: () => true // Resolve any status code
      });

      responseTime = Date.now() - startTime;
      httpStatus = response.status;

      if (httpStatus === app.expected_status_code) {
        if (responseTime > app.timeout_ms) {
          status = 'degraded';
        } else {
          status = 'online';
        }
      } else {
        status = 'degraded';
        errorMessage = `Expected ${app.expected_status_code} but got ${httpStatus}`;
      }
    } catch (error: any) {
      responseTime = Date.now() - startTime;
      status = 'offline';
      errorMessage = error.message;
      if (error.code === 'ECONNABORTED') {
        errorMessage = 'Timeout exceeded';
      }
    }

    // Save check result
    await db.query(
      'INSERT INTO ap_checks (application_id, status, http_status_code, response_time_ms, error_message) VALUES ($1, $2, $3, $4, $5)',
      [app.id, status, httpStatus, responseTime, errorMessage]
    );

    // Update application status if it changed
    if (app.current_status !== status) {
      await db.query(
        'INSERT INTO ap_status_history (application_id, old_status, new_status, reason) VALUES ($1, $2, $3, $4)',
        [app.id, app.current_status, status, errorMessage || 'Status change detected via monitoring']
      );
    }

    // Always update last_checked_at and current_status
    await db.query(
      'UPDATE ap_applications SET current_status = $1, last_checked_at = CURRENT_TIMESTAMP WHERE id = $2',
      [status, app.id]
    );

    return { status, httpStatus, responseTime, errorMessage };
  }
}