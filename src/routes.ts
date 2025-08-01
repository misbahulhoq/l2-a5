import { Router } from "express";
import { AuthRoutes } from "./modules/auth/auth.route";
import { UserRoutes } from "./modules/user/user.route";

export const routes = Router();

const routesModule: { path: string; route: Router }[] = [
  { path: "/auth", route: AuthRoutes },
  { path: "/users", route: UserRoutes },
];

routesModule.forEach((route) => {
  routes.use(route.path, route.route);
});

export default routes;
