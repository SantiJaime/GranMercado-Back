import express from "express";
import morgan from "morgan";
import cors from "cors";
import usersRoutes from "../routes/users.routes";
import { PORT } from "../constants/const";

class Server {
  private app: express.Application;
  constructor() {
    this.app = express();
    this.middleware();
    this.routes();
  }
  private middleware(): void {
    this.app.use(express.json());
    this.app.use(morgan("dev"));
    this.app.use(cors());
  }
  private routes(): void {
    this.app.use("/users", usersRoutes);
  }
  listen(): void {
    this.app.listen(PORT, () => console.log("Servidor en línea"));
  }
}
export default Server;
