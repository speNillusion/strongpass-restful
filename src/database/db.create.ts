import { dbConnection } from './db.connect';

export class DbCreate {
  public async createDb(): Promise<void> {
    try {
      
      dbConnection.query(
        `CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY, 
          name VARCHAR(255) NOT NULL, 
          email VARCHAR(255) UNIQUE NOT NULL, 
          pass VARCHAR(255) NOT NULL CHECK(LENGTH(pass) >= 6)
        )`,
        (err, results) => {
          if (err) {
            console.error('Erro ao criar tabela:', err.message);
          } else {
            console.log('Tabela "users" criada ou já existe.');
            return results;
          }
        }
      );
    } catch (err) {
      console.error('Erro ao criar banco de dados:', err);
    }
  }
}
