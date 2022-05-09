"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_json_1 = __importDefault(require("@config/auth.json"));
const handle = (request, response, next) => {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
        return response.status(401).send({ error: 'No token provided' });
    }
    const parts = authHeader.split(' ');
    if (parts.length !== 2) {
        return response.status(401).send({ error: 'Token error' });
    }
    const [scheme, token] = parts;
    if (!/^Bearer$/i.test(scheme)) {
        return response.status(401).send({ error: 'Token malformatted' });
    }
    jsonwebtoken_1.default.verify(token, auth_json_1.default.secret, (err, decoded) => {
        if (err) {
            return response.status(401).send({ error: 'Token invalid' });
        }
        response.userId = decoded.id;
        return next();
    });
};
exports.default = handle;
