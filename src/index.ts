import 'dotenv/config';
import Server from "./server/app";

const server = new Server();
server.listen();