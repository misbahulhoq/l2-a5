import { Router } from "express";
import { AuthRoutes } from "./modules/auth/auth.route";
import { UserRoutes } from "./modules/user/user.route";
import { DriverRoutes } from "./modules/driver/driver.route";

export const routes = Router();

const routesModule: { path: string; route: Router }[] = [
  { path: "/auth", route: AuthRoutes },
  { path: "/users", route: UserRoutes },
  { path: "/drivers", route: DriverRoutes },
];

routesModule.forEach((route) => {
  routes.use(route.path, route.route);
});

export default routes;
