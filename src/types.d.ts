interface User {
  id: number;
  fullName: string;
  email: string;
  password: string;
  name_role: string;
}

type JWT_User = Pick<User, "email" | "id" | "name_role">;
