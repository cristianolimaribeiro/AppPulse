import { db } from '../database/connection';
import { MonitoringService } from './monitoringService';

export class ApplicationService {
  private monitoringService = new MonitoringService();

  async list() {
    const result = await db.query('SELECT * FROM ap_applications ORDER BY id DESC');
    return result.rows;
  }

  async getById(id: number) {
    const result = await db.query('SELECT * FROM ap_applications WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      throw { status: 404, message: 'Aplicação não encontrada' };
    }
    return result.rows[0];
  }

  async create(data: any) {
    const { name, description, url, environment, criticality, expected_status_code, timeout_ms, check_interval_minutes, monitoring_enabled } = data;

    const result = await db.query(
      `INSERT INTO ap_applications
       (name, description, url, environment, criticality, expected_status_code, timeout_ms, check_interval_minutes, monitoring_enabled)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [name, description, url, environment || 'production', criticality || 'medium', expected_status_code || 200, timeout_ms || 5000, check_interval_minutes || 5, monitoring_enabled ?? true]
    );

    return result.rows[0];
  }

  async update(id: number, data: any) {
    const { name, description, url, environment, criticality, expected_status_code, timeout_ms, check_interval_minutes } = data;

    const result = await db.query(
      `UPDATE ap_applications
       SET name = $1, description = $2, url = $3, environment = $4, criticality = $5,
           expected_status_code = $6, timeout_ms = $7, check_interval_minutes = $8, updated_at = CURRENT_TIMESTAMP
       WHERE id = $9 RETURNING *`,
      [name, description, url, environment, criticality, expected_status_code, timeout_ms, check_interval_minutes, id]
    );

    if (result.rows.length === 0) {
      throw { status: 404, message: 'Aplicação não encontrada' };
    }

    return result.rows[0];
  }

  async delete(id: number) {
    const result = await db.query('DELETE FROM ap_applications WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      throw { status: 404, message: 'Aplicação não encontrada' };
    }
  }

  async toggleMonitoring(id: number, enabled: boolean) {
    const result = await db.query(
      `UPDATE ap_applications SET monitoring_enabled = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
      [enabled, id]
    );
    if (result.rows.length === 0) {
      throw { status: 404, message: 'Aplicação não encontrada' };
    }
    return result.rows[0];
  }

  async setMaintenance(id: number, maintenance: boolean) {
    const newStatus = maintenance ? 'maintenance' : 'unknown';
    
    // We get the current app first to record status history
    const app = await this.getById(id);
    
    if (app.current_status !== newStatus) {
      await db.query(`INSERT INTO ap_status_history (application_id, old_status, new_status, reason) VALUES ($1, $2, $3, $4)`, 
        [id, app.current_status, newStatus, maintenance ? 'Colocado em manutenção manualmente' : 'Removido da manutenção manualmente']);
    }

    const result = await db.query(
      `UPDATE ap_applications SET current_status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
      [newStatus, id]
    );
    
    return result.rows[0];
  }

  async triggerCheck(id: number) {
    const app = await this.getById(id);
    if (app.current_status === 'maintenance') {
      throw { status: 400, message: 'Não é possível verificar uma aplicação em manutenção' };
    }
    
    await this.monitoringService.checkApplication(app);
    return this.getById(id);
  }

  async getChecks(id: number) {
    const result = await db.query(
      'SELECT * FROM ap_checks WHERE application_id = $1 ORDER BY checked_at DESC LIMIT 50',
      [id]
    );
    return result.rows;
  }

  async getStatusHistory(id: number) {
    const result = await db.query(
      'SELECT * FROM ap_status_history WHERE application_id = $1 ORDER BY created_at DESC LIMIT 50',
      [id]
    );
    return result.rows;
  }
}