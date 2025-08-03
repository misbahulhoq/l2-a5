"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const express_1 = require("express");
const auth_route_1 = require("./modules/auth/auth.route");
const user_route_1 = require("./modules/user/user.route");
const driver_route_1 = require("./modules/driver/driver.route");
const ride_route_1 = require("./modules/ride/ride.route");
exports.routes = (0, express_1.Router)();
const routesModule = [
    { path: "/auth", route: auth_route_1.AuthRoutes },
    { path: "/users", route: user_route_1.UserRoutes },
    { path: "/drivers", route: driver_route_1.DriverRoutes },
    { path: "/rides", route: ride_route_1.RideRoutes },
];
routesModule.forEach((route) => {
    exports.routes.use(route.path, route.route);
});
exports.default = exports.routes;
