"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedAdmin = seedAdmin;
const user_model_1 = require("../modules/user/user.model");
function seedAdmin(email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const adminExists = yield user_model_1.User.findOne({ email });
        if (adminExists) {
            console.log("Admin already exists.");
            return;
        }
        const admin = new user_model_1.User({
            name: "Admin",
            email,
            password,
            role: "admin",
            status: "active",
        });
        yield admin.save();
        console.log("Admin created successfully.");
    });
}
exports.default = seedAdmin;
