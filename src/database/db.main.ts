import { DbCreate } from "./db.create";
import { Database } from 'sqlite3';

const dbCreate = new DbCreate();

dbCreate.createDb()
  .then(() => {
    console.log('Banco de dados e tabela verificados ou criados com sucesso.');
  })
  .catch(err => {
    console.error('Erro ao criar banco de dados:', err);
  });

export class DbMain {
    
    
    public async get(arg0: string, arg1: string[], arg2: (err: any, row: any) => void) {
        const db = await this.DatabaseConnect();
        if (db) {
            db.get(arg0, arg1, (err, row) => {
                if (err) {
                    console.error('Erro ao consultar dados:', err.message);
                    arg2(err, null);
                } else {
                    arg2(null, row);
                }
            });
        } else {
            throw new Error('Falha na conexão com o banco de dados');
        }
    }

    private async DatabaseConnect(): Promise<Database | null> {
        return new Promise((resolve, reject) => {
            const db = new Database('src/database/genpass.db', (err) => {
                if (err) {
                    console.error('Erro ao conectar ao banco de dados:', err.message);
                    reject(null);
                } else {
                    resolve(db);
                }
            });
        });
    }

    public async getDb(): Promise<any[]> {
        const db = await this.DatabaseConnect();
        if (db) {
            return new Promise((resolve, reject) => {
                db.all('SELECT * FROM users', [], (err, rows) => {
                    if (err) {
                        console.error('Erro ao consultar dados:', err.message);
                        reject([]); 
                    } else {
                        console.log('Dados na tabela "users":', rows);
                        resolve(rows); 
                    }
                });
            });
        } else {
            throw new Error('Falha na conexão com o banco de dados');
        }
    }

    public async pushDb(nome: string, email: string, pass: string): Promise<boolean> {
        const db = await this.DatabaseConnect();
        
        if (db) {
            return new Promise((resolve, reject) => {
                const stmt = db.prepare('INSERT INTO users (name, email, pass) VALUES (?, ?, ?)');
    
                stmt.run(nome, email, pass, function (err) {
                    if (err) {
                        console.error('Erro ao inserir dados:', err.message);
                        reject(false);
                    } else {
                        console.log('Dados inseridos com sucesso.');
                        resolve(true);
                    }
                });
    
                stmt.finalize(); 
            });
        } else {
            throw new Error('Falha na conexão com o banco de dados');
        }
    }
}
