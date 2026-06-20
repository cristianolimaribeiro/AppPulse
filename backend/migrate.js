const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionString = process.env.MIGRATE_DATABASE_URL;

if (!connectionString) {
  console.error('Erro: A variável de ambiente MIGRATE_DATABASE_URL não foi definida.');
  process.exit(1);
}

async function runMigration() {
  console.log('Iniciando conexão com o banco de dados remoto...');
  
  // Conexão segura exigida pela Render
  const client = new Client({
    connectionString: connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    console.log('Conectado com sucesso ao PostgreSQL na Render!');

    // Carregar schema e seed
    const schemaPath = path.join(__dirname, '../database/schema.sql');
    const seedPath = path.join(__dirname, '../database/seed.sql');

    console.log(`Lendo arquivo de Schema: ${schemaPath}`);
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    console.log(`Lendo arquivo de Seed: ${seedPath}`);
    const seedSql = fs.readFileSync(seedPath, 'utf8');

    console.log('Executando criação do schema...');
    await client.query(schemaSql);
    console.log('Schema criado com sucesso!');

    console.log('Populando banco com os dados iniciais (seed)...');
    await client.query(seedSql);
    console.log('Dados populados com sucesso!');

  } catch (error) {
    console.error('Erro durante a migração:', error);
    process.exit(1);
  } finally {
    await client.end();
    console.log('Conexão encerrada com o banco de dados.');
  }
}

runMigration();
