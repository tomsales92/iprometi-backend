"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const recordDays_1 = __importDefault(require("./recordDays"));
const routes = (0, express_1.default)();
routes.use('/records', recordDays_1.default);
exports.default = routes;
