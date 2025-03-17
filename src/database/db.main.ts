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
      dbConnection.query('SELECT * FROM users', (err: any, rows: string[]) => {
        if (err) {
          console.error('Erro ao consultar dados:', err.message);
          reject([]); // Caso dê erro, retorna um array vazio
        } else {
          console.log('Dados na tabela "users":', rows);
          resolve(rows); // Retorna os dados encontrados
        }
      });
    });
  }

  public async pushDb(nome: string, email: string, pass: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      dbConnection.query(
        'INSERT INTO users (name, email, pass) VALUES (?, ?, ?)',
        [nome, email, pass],
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
