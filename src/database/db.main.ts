// dbmain.ts
import { dbConnection } from './db.connect';

export class DbMain {
  public async get(query: string, params: string[]): Promise<any> {
    return new Promise((resolve, reject) => {
      dbConnection.query(query, params, (err, row) => {
        if (err) {
          console.error('Erro ao consultar dados:', err.message);
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  public async getDb(): Promise<any[]> {
    return this.get('SELECT * FROM users', []);
  }

  public async getKey(email: string): Promise<string> {
    const results = await this.get('SELECT token_key FROM users WHERE email = ?', [email]);
    return results.length ? results[0].token_key : '';
  }

  public async getId(email: string): Promise<number | null> {
    const results = await this.get('SELECT id FROM users WHERE email = ?', [email]);
    return results.length ? results[0].id : null;
  }

  public async pushDb(nome: string, email: string, pass: string, token_key: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      dbConnection.query(
        'INSERT INTO users (name, email, pass, token_key) VALUES (?, ?, ?, ?)',
        [nome, email, pass, token_key],
        (err) => {
          if (err) {
            console.error('Erro ao inserir dados:', err.message);
            reject(false);
          } else {
            console.log('Dados inseridos com sucesso.');
            resolve(true);
          }
        }
      );
    });
  }
}