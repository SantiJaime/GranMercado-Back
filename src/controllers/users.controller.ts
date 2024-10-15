import type { Request, Response } from "express";
import type { RowDataPacket } from "mysql2";
import dbConnection from "../database/db.config";
import * as bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import { generateToken, verifyToken } from "../middleware/jwt.config";
import { JWT_SECRET_KEY } from "../constants/const";
import type { Secret } from "jsonwebtoken";

export const getAllUsers = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const [allUsers] = await dbConnection.query(
      "SELECT u.id, u.email, u.fullName, ur.name_role AS role FROM user u LEFT JOIN user_role ur ON (u.id_role = ur.id_role)"
    );
    res
      .status(200)
      .json({ msg: "Usuarios encontrados correctamente", allUsers });
  } catch (error) {
    res.status(500).json({ msg: "No se pudieron obtener los usuarios", error });
  }
};

export const getOneUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(422).json(errors.array());
    return;
  }
  try {
    const [oneUser] = await dbConnection.query<RowDataPacket[]>(
      "SELECT u.id, u.email, u.fullName, ur.name_role FROM user u LEFT JOIN user_role ur ON (u.id_role = ur.id_role) WHERE id = ?",
      [req.params.id]
    );
    if (oneUser.length === 0) {
      res.status(404).json({ msg: "No se pudo encontrar el usuario" });
      return;
    }
    res.status(200).json({ msg: "Usuario encontrado", oneUser });
  } catch (error) {
    res.status(500).json({ msg: "No se pudo encontrar el usuario", error });
  }
};

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(422).json(errors.array());
    return;
  }
  try {
    const { email, fullName, password, id_role } = req.body;

    const roleId: number = id_role ? id_role : 1;

    const [userExist] = await dbConnection.query<RowDataPacket[]>(
      "SELECT * FROM user WHERE email = ?",
      [email]
    );
    if (userExist.length > 0) {
      res
        .status(400)
        .json({ msg: "El correo electrónico ingresado ya está registrado" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await dbConnection.query(
      "INSERT INTO user (email, fullName, password, id_role) VALUES (?, ?, ?, ?)",
      [email, fullName, hashedPassword, roleId]
    );
    res.status(201).json({
      msg: "Usuario creado correctamente",
      newUser: {
        email,
        fullName,
        role: roleId === 1 ? "Usuario" : "Administrador",
      },
    });
  } catch (error) {
    res.status(500).json({ msg: "No se pudo crear el usuario", error });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(422).json(errors.array());
    return;
  }
  try {
    const [userExist] = await dbConnection.query<RowDataPacket[]>(
      "SELECT u.id, u.email, u.password, ur.name_role AS role FROM user u LEFT JOIN user_role ur ON (u.id_role = ur.id_role) WHERE email = ?",
      [req.body.email]
    );
    if (userExist.length === 0) {
      res
        .status(401)
        .json({ msg: "Correo electrónico y/o contraseña incorrectos" });
      return;
    }
    const { password, ...userData } = userExist[0];

    const validPassword = await bcrypt.compare(req.body.password, password);
    if (!validPassword) {
      res
        .status(401)
        .json({ msg: "Correo electrónico y/o contraseña incorrectos" });
      return;
    }

    const token = generateToken({
      id: userExist[0].id,
      email: userExist[0].email,
      name_role: userExist[0].role,
    });

    res.status(200).json({
      msg: "Sesión iniciada correctamente",
      userData,
      token,
    });
  } catch (error) {
    res.status(500).json({ msg: "Error al iniciar sesión", error });
  }
};

export const tokenAuthentication = (req: Request, res: Response): void => {
  try {
    if (!req.body.token) {
      res.status(422).json({ msg: "No se ha ingresado ningún token" });
      return;
    }
    const verifiedToken = verifyToken(req.body.token, JWT_SECRET_KEY as Secret);

    if (verifiedToken) {
      res
        .status(200)
        .json({ msg: "Autenticación exitosa", isTokenVerified: true });
    } else {
      res.status(401).json({ msg: "Token inválido o expirado" });
    }
  } catch (error) {
    res.status(500).json({ msg: "No se pudo verificar el token", error });
  }
};

export const updateUserFullName = async (
  req: Request,
  res: Response
): Promise<void> => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(422).json(errors.array());
    return;
  }
  try {
    await dbConnection.query("UPDATE user SET fullName = ? WHERE id = ?", [
      req.body.fullName,
      req.params.id,
    ]);

    res.status(200).json({
      msg: "Nombre de usuario actualizado correctamente",
      fullName: req.body.fullName,
    });
  } catch (error) {
    res.status(500).json({ msg: "No se pudo actualizar el usuario", error });
  }
};

export const updateUserRole = async (
  req: Request,
  res: Response
): Promise<void> => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(422).json(errors.array());
    return;
  }
  try {
    await dbConnection.query("UPDATE user SET id_role = ? WHERE id = ?", [
      req.body.id_role,
      req.params.id,
    ]);

    res.status(200).json({
      msg: "Rol del usuario actualizado correctamente",
      id_role: req.body.id_role,
    });
  } catch (error) {
    res.status(500).json({ msg: "No se pudo actualizar el usuario", error });
  }
};

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(422).json(errors.array());
    return;
  }
  try {
    await dbConnection.query("DELETE FROM user WHERE id = ?", [req.params.id]);
    res.status(200).json({ msg: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(200).json({ msg: "No se pudo eliminar el usuario", error });
  }
};
