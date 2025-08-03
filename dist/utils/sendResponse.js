"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = void 0;
const sendResponse = (res, data) => {
    res.status(data.statusCode).json(data);
};
exports.sendResponse = sendResponse;
exports.default = exports.sendResponse;
