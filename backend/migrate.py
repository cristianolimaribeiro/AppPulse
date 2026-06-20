import os
import sys
import ssl
from urllib.parse import urlparse
import pg8000.dbapi

def run_migration():
    db_url = os.environ.get('MIGRATE_DATABASE_URL')
    if not db_url:
        print("Erro: A variável de ambiente MIGRATE_DATABASE_URL não foi definida.")
        sys.exit(1)

    print("Iniciando conexão com o banco de dados remoto da Render via Python...")
    
    # Parse da URL do PostgreSQL
    try:
        result = urlparse(db_url)
        username = result.username
        password = result.password
        database = result.path[1:] # remove leading slash '/'
        hostname = result.hostname
        port = result.port or 5432
    except Exception as e:
        print(f"Erro ao fazer o parse da URL de conexão: {e}")
        sys.exit(1)

    # Configuração de SSL seguro exigido pela Render
    ssl_context = ssl.create_default_context()
    ssl_context.check_hostname = False
    ssl_context.verify_mode = ssl.CERT_NONE

    try:
        conn = pg8000.dbapi.connect(
            user=username,
            password=password,
            host=hostname,
            port=port,
            database=database,
            ssl_context=ssl_context
        )
        cursor = conn.cursor()
        print("Conectado com sucesso ao PostgreSQL na Render!")

        # Garantir isolamento por Schema
        print("Garantindo existência do schema 'apppulse'...")
        cursor.execute("CREATE SCHEMA IF NOT EXISTS apppulse;")
        cursor.execute("SET search_path TO apppulse;")
        
        # Caminho dos scripts SQL
        base_dir = os.path.dirname(os.path.abspath(__file__))
        schema_path = os.path.join(base_dir, '..', 'database', 'schema.sql')
        seed_path = os.path.join(base_dir, '..', 'database', 'seed.sql')

        print(f"Lendo arquivo de Schema: {schema_path}")
        with open(schema_path, 'r', encoding='utf-8') as f:
            schema_sql = f.read()

        print(f"Lendo arquivo de Seed: {seed_path}")
        with open(seed_path, 'r', encoding='utf-8') as f:
            seed_sql = f.read()

        print("Executando criação do schema (tabelas) no namespace 'apppulse'...")
        cursor.execute(schema_sql)
        print("Schema criado com sucesso!")

        print("Populando banco com os dados iniciais (seed)...")
        cursor.execute(seed_sql)
        print("Dados populados com sucesso!")

        # Confirmar transações
        conn.commit()
        print("Migração concluída com sucesso!")

    except Exception as error:
        print(f"Erro durante a migração: {error}")
        sys.exit(1)
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()
        print("Conexão encerrada com o banco de dados.")

if __name__ == "__main__":
    run_migration()
