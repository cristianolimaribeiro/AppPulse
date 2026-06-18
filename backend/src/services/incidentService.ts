import { db } from '../database/connection';

export class IncidentService {
  async list() {
    const result = await db.query(`
      SELECT i.*, a.name as application_name, u.name as created_by_name
      FROM ap_incidents i
      JOIN ap_applications a ON i.application_id = a.id
      LEFT JOIN ap_users u ON i.created_by = u.id
      ORDER BY i.id DESC
    `);
    return result.rows;
  }

  async getById(id: number) {
    const result = await db.query(`
      SELECT i.*, a.name as application_name, u.name as created_by_name
      FROM ap_incidents i
      JOIN ap_applications a ON i.application_id = a.id
      LEFT JOIN ap_users u ON i.created_by = u.id
      WHERE i.id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      throw { status: 404, message: 'Incidente não encontrado' };
    }
    return result.rows[0];
  }

  async create(data: any, userId: number) {
    const { application_id, title, description, severity, status } = data;

    const result = await db.query(
      `INSERT INTO ap_incidents
       (application_id, title, description, severity, status, created_by)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [application_id, title, description, severity || 'medium', status || 'open', userId]
    );

    return result.rows[0];
  }

  async update(id: number, data: any) {
    const { title, description, severity, status } = data;

    const result = await db.query(
      `UPDATE ap_incidents
       SET title = $1, description = $2, severity = $3, status = $4, updated_at = CURRENT_TIMESTAMP
       WHERE id = $5 RETURNING *`,
      [title, description, severity, status, id]
    );

    if (result.rows.length === 0) {
      throw { status: 404, message: 'Incidente não encontrado' };
    }

    return result.rows[0];
  }

  async resolve(id: number) {
    const result = await db.query(
      `UPDATE ap_incidents
       SET status = 'resolved', resolved_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      throw { status: 404, message: 'Incidente não encontrado' };
    }

    return result.rows[0];
  }

  async delete(id: number) {
    const result = await db.query('DELETE FROM ap_incidents WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      throw { status: 404, message: 'Incidente não encontrado' };
    }
  }
}