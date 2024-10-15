import { type Secret } from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";
import { JWT_SECRET_KEY } from "../constants/const";
import { verifyToken } from "./jwt.config";

const auth =
  (roles: string[]) =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      const token = req.header("Authorization")?.replace("Bearer ", "");
      if (!token) {
        res.status(401).json({ msg: "No existe token" });
        return;
      }
      const verify = verifyToken(token, JWT_SECRET_KEY as Secret);
      if (verify && roles.includes(verify.user.name_role)) next();
      else res.status(401).json({ msg: "No estás autorizado" });
    } catch (error) {
      res.status(500).json({ msg: "Error al obtener el token", error });
    }
  };

export default auth;
