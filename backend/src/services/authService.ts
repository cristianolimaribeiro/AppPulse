import { db } from '../database/connection';
import { comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';

export class AuthService {
  async login(email: string, passwordString: string) {
    console.log(`[AuthService] Attempting login for: ${email}`);
    const result = await db.query('SELECT * FROM ap_users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      console.log('[AuthService] User not found in database');
      throw { status: 401, message: 'Credenciais inválidas' };
    }

    console.log(`[AuthService] User found. ID: ${user.id}, Active: ${user.active}`);

    if (!user.active) {
      console.log('[AuthService] User is inactive');
      throw { status: 403, message: 'Usuário inativo' };
    }

    const isMatch = await comparePassword(passwordString, user.password_hash);
    
    if (!isMatch) {
      throw { status: 401, message: 'Credenciais inválidas' };
    }

    const token = generateToken({ id: user.id, role: user.role });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async getMe(id: number) {
    const result = await db.query('SELECT id, name, email, role, active FROM ap_users WHERE id = $1', [id]);
    const user = result.rows[0];

    if (!user) {
      throw { status: 404, message: 'Usuário não encontrado' };
    }

    return user;
  }
}