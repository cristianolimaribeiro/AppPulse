import { db } from '../database/connection';
import { hashPassword } from '../utils/password';

export class UserService {
  async list() {
    const result = await db.query('SELECT id, name, email, role, active, created_at, updated_at FROM ap_users ORDER BY id DESC');
    return result.rows;
  }

  async create(data: any) {
    const { name, email, password, role } = data;
    const hashed = await hashPassword(password);

    const result = await db.query(
      `INSERT INTO ap_users (name, email, password_hash, role)
       VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, active, created_at`,
      [name, email, hashed, role || 'viewer']
    );

    return result.rows[0];
  }

  async update(id: number, data: any) {
    const { name, role } = data;

    const result = await db.query(
      `UPDATE ap_users SET name = $1, role = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3 RETURNING id, name, email, role, active, updated_at`,
      [name, role, id]
    );

    if (result.rows.length === 0) {
      throw { status: 404, message: 'Usuário não encontrado' };
    }

    return result.rows[0];
  }

  async toggleActive(id: number, active: boolean) {
    const result = await db.query(
      `UPDATE ap_users SET active = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2 RETURNING id, name, email, role, active, updated_at`,
      [active, id]
    );

    if (result.rows.length === 0) {
      throw { status: 404, message: 'Usuário não encontrado' };
    }

    return result.rows[0];
  }
}