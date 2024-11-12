import { createConnection, type Connection } from "mysql2/promise";
import { DB_HOST_DEPLOY, DB_NAME_DEPLOY, DB_PASSWORD_DEPLOY, DB_USER_DEPLOY } from "../constants/const";

async function connectToDatabase(): Promise<Connection> {
  try {
    const connection = await createConnection({
      host: DB_HOST_DEPLOY,
      user: DB_USER_DEPLOY,
      password: DB_PASSWORD_DEPLOY,
      database: DB_NAME_DEPLOY,
    });

    console.log('Base de datos operativa');
    return connection;
  } catch (err) {
    console.error('Error al conectarse a la base de datos', err);
    throw err;
  }
}

export default connectToDatabase;