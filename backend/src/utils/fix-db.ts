import { db } from '../database/connection';

async function fix() {
  console.log('🚀 Iniciando correção de acentuação via Node.js...');
  try {
    // Corrigir Incidentes
    await db.query(`
      UPDATE ap_incidents 
      SET description = 'O sistema retornou erro 500 nas últimas verificações.' 
      WHERE id = 1
    `);

    // Corrigir Histórico
    await db.query(`
      UPDATE ap_status_history 
      SET reason = 'Primeira verificação bem sucedida' 
      WHERE reason LIKE 'Primeira%'
    `);
    
    await db.query(`
      UPDATE ap_status_history 
      SET reason = 'Retornou 500 Internal Server Error' 
      WHERE reason LIKE 'Retornou 500%'
    `);

    console.log('✅ Banco de dados corrigido com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao corrigir banco:', error);
  } finally {
    process.exit();
  }
}

fix();