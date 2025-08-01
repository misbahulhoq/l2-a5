export type TUserRole = "admin" | "rider" | "driver";

export type TUser = {
  name: string;
  email: string;
  password?: string; // Password is optional on return types
  role: "admin" | "rider" | "driver";
  status: "active" | "blocked";
};
