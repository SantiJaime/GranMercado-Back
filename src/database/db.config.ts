import { createPool } from "mysql2/promise";
import { DB_HOST_DEPLOY, DB_NAME_DEPLOY, DB_PASSWORD_DEPLOY, DB_USER_DEPLOY } from "../constants/const";

const pool = createPool({
  host: DB_HOST_DEPLOY,
  user: DB_USER_DEPLOY,
  password: DB_PASSWORD_DEPLOY,
  database: DB_NAME_DEPLOY,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
export default pool;