import { dbConnection } from './db.connect';

export class DbMain {
  public async get(arg0: string, arg1: string[], arg2: (err: any, row: any) => void): Promise<void> {
    dbConnection.query(arg0, arg1, (err, row) => {
      if (err) {
        console.error('Erro ao consultar dados:', err.message);
        arg2(err, null);
      } else {
        arg2(null, row);
      }
    });
  }

  public async getDb(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      dbConnection.query('SELECT * FROM users', (err: Error, rows: string[]) => {
        if (err) {
          console.error('Erro ao consultar dados:', err.message);
          reject([]); 
        } else {
          console.log('Dados na tabela "users":', rows);
          resolve(rows); 
        }
      });
    });
  }

  public async getKey(email: string): Promise<string> {
    return new Promise((resolve, reject) => {
      dbConnection.query('SELECT * FROM users WHERE email = ?', [email], (err, results: any[]) => {
        if (err) {
          reject(err);
        } else {
          let key = results[0].token_key;
          resolve(key || '');
        }
      });
    });
  }

  public async getId(email: string): Promise<number> {
    return new Promise((resolve, reject) => {
      dbConnection.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) {
          reject(err);
        } else {
          let id = results[0].id;
          resolve(id || null);
        }
      });
    });
  }

  public async pushDb(nome: string, email: string, pass: string, token_key: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      dbConnection.query(
        'INSERT INTO users (name, email, pass, token_key) VALUES (?, ?, ?, ?)',
        [nome, email, pass, token_key],
        (err, results) => {
          if (err) {
            console.error('Erro ao inserir dados:', err.message);
            reject(false);
          } else {
            console.log('Dados inseridos com sucesso.');
            resolve(true);
            return results;
          }
        }
      );
    });
  }
}
