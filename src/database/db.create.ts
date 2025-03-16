import { Database } from 'sqlite3';
import { checkDb } from './db.check';

const db = new Database('src/database/genpass.db', (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.message);
    return false;
  } else {
    console.log('Conectado ao banco de dados SQLite');
    return true;
  }
});

// criação de db
export class DbCreate {
  public async createDb(): Promise<void> {
    try {
      const tableExists = await checkDb(db); 
      if (!tableExists) {
        db.serialize(() => {
          db.run(
            'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT, pass TEXT, CHECK(length(pass) >= 6))',
            (err) => {
              if (err) {
                console.error('Erro ao criar tabela:', err.message);
              } else {
                console.log('Tabela "users" criada ou já existe.');
              }
            }
          );
        });
      }
    } catch (err) {
      console.error('Erro ao verificar a tabela:', err);
    }
  }
}
