import { Router } from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getOneUser,
  loginUser,
  tokenAuthentication,
  updateUserFullName,
  updateUserRole,
} from "../controllers/users.controller";
import { check } from "express-validator";
import auth from "../middleware/auth";

const router = Router();

router.get("/", getAllUsers);
router.get(
  "/:id",
  [
    check("id", "Campo ID obligatorio").notEmpty(),
    check("id", "Formato de ID inválido").isNumeric().isInt({ min: 1 }),
  ],
  getOneUser
);
router.post(
  "/",
  [
    check("email", "Formato de correo electrónico inválido").isEmail(),
    check("email", "Campo correo electrónico obligatorio").notEmpty(),
    check("fullName", "Campo nombre completo obligatorio").notEmpty(),
    check(
      "fullName",
      "El nombre completo debe tener un mínimo de 3 caracteres y un máximo de 100"
    ).isLength({ min: 8, max: 100 }),
    check("password", "Campo contraseña obligatorio").notEmpty(),
    check(
      "password",
      "La contraseña debe tener un mínimo de 8 caracteres"
    ).isLength({ min: 8 }),
  ],
  createUser
);
router.post(
  "/login",
  [
    check("email", "Formato de correo electrónico inválido").isEmail(),
    check("email", "Campo correo electrónico obligatorio").notEmpty(),
    check("password", "Campo contraseña obligatorio").notEmpty(),
  ],
  loginUser
);
router.post("/verify-token", tokenAuthentication);
router.patch(
  "/updateName/:id",
  auth(["Usuario", "Administrador"]),
  [
    check("id", "Campo ID obligatorio").notEmpty(),
    check("id", "Formato de ID inválido").isNumeric().isInt({ min: 1 }),
    check("fullName", "Campo nombre completo obligatorio").notEmpty(),
    check(
      "fullName",
      "El nombre completo debe tener un mínimo de 3 caracteres y un máximo de 100"
    ).isLength({ min: 3, max: 100 }),
  ],
  updateUserFullName
);
router.patch(
  "/updateRole/:id",
  auth(["Administrador"]),
  [
    check("id", "Campo ID obligatorio").notEmpty(),
    check("id", "Formato de ID inválido").isNumeric().isInt({ min: 1 }),
    check("id_role", "Campo ID de rol obligatorio").notEmpty(),
    check("id_role", "Formato de ID de rol inválido")
      .isNumeric()
      .isInt({ min: 1, max: 2 }),
  ],
  updateUserRole
);
router.delete(
  "/:id",
  auth(["Administrador"]),
  [
    check("id", "Campo ID obligatorio").notEmpty(),
    check("id", "Formato de ID inválido").isNumeric().isInt({ min: 1 }),
  ],
  deleteUser
);

export default router;
