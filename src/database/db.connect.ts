import * as mysql from 'mysql2';
import * as dotenv from 'dotenv';
import { DbCreate } from './db.create';

dotenv.config();


export const dbConnection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});


dbConnection.connect(async (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados MySQL:', err.message);
    return;
  }
  console.log('Conectado ao banco de dados MySQL');
  const createTables = new DbCreate();
  await createTables.createDb();
});
