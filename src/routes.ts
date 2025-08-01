import { Router } from "express";
import { AuthRoutes } from "./modules/auth/auth.route";
import { UserRoutes } from "./modules/user/user.route";
import { DriverRoutes } from "./modules/driver/driver.route";
import { RideRoutes } from "./modules/ride/ride.route";

export const routes = Router();

const routesModule: { path: string; route: Router }[] = [
  { path: "/auth", route: AuthRoutes },
  { path: "/users", route: UserRoutes },
  { path: "/drivers", route: DriverRoutes },
  { path: "/rides", route: RideRoutes },
];

routesModule.forEach((route) => {
  routes.use(route.path, route.route);
});

export default routes;
