import jwt, {
  type JwtPayload,
  type Secret,
} from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../constants/const";

export const generateToken = (user: JWT_User): string | Error => {
  const token = jwt.sign({ user }, JWT_SECRET_KEY as Secret);
  return token;
};

export const verifyToken = (
  token: string,
  secretKey: Secret
): JwtPayload | null => {
  try {
    const verify = jwt.verify(token, secretKey) as JwtPayload;
    return verify;
  } catch (error) {
    console.error("Error de JWT:", error);
    throw error;
  }
};
