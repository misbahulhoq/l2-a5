import { Router } from "express";
import { AuthRoutes } from "./modules/auth/auth.route";

export const routes = Router();

const routesModule: { path: string; route: Router }[] = [
  { path: "/auth", route: AuthRoutes },
];

routesModule.forEach((route) => {
  routes.use(route.path, route.route);
});

export default routes;
