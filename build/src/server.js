"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("@routes/v1/routes"));
const port = 3000;
const host = '0.0.0.0';
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(routes_1.default);
app.get('/', (req, res) => {
    res.send('Server is running');
});
app.listen(port, host);
