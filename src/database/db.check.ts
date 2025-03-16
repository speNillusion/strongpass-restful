import { Database } from 'sqlite3';

export function checkDb(db: Database): Promise<boolean> {
  return new Promise((resolve, reject) => {
    db.get('SELECT name FROM sqlite_master WHERE type="table" AND name="users";', (err, row) => {
      if (err) {
        console.error('Erro ao verificar a tabela:', err.message);
        reject(false);
      }
      if (!row) {
        console.log('Tabela "users" não existe.');
        resolve(false);
      } else {
        console.log('Tabela "users" já existe.');
        resolve(true);
      }
    });
  });
}
