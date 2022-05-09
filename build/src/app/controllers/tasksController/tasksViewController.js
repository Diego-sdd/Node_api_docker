"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const getTasksModel_1 = __importDefault(require("@models/tasksModel/getTasksModel"));
const getUserModels_1 = __importDefault(require("@models/usersModel/getUserModels"));
class ViewTasks {
    async ViewTaskUser(request, response) {
        const { idUser } = request.query;
        const errors = (0, express_validator_1.validationResult)(request);
        if (!errors.isEmpty()) {
            return response.status(422).json({ errors: errors.array() });
        }
        if (!idUser) {
            return response.status(404).json({ body: 'missing information' });
        }
        const checkUserId = await (0, express_validator_1.check)('idUser')
            .notEmpty()
            .isNumeric()
            .run(request);
        if (checkUserId.context.errors.length > 0) {
            return response.status(406).json({
                error: 'incorrect parameters'
            });
        }
        try {
            const resultUpdate = await getTasksModel_1.default.getTaskFilterUser(idUser);
            resultUpdate.map((e, k) => {
                if (e.deadline > new Date()) {
                    resultUpdate[k].lateTask = false;
                }
                else {
                    resultUpdate[k].lateTask = true;
                }
                return null;
            });
            return response.status(200).json({
                body: resultUpdate
            });
        }
        catch (error) {
            return response.status(500).json({ error });
        }
    }
    async ViewAllTask(request, response) {
        const { email, page, pageSize, order, orderBy } = request.query;
        const errors = (0, express_validator_1.validationResult)(request);
        if (!errors.isEmpty()) {
            return response.status(422).json({ errors: errors.array() });
        }
        if (!email) {
            return response.status(404).json({ body: 'missing information' });
        }
        const checkUserId = await (0, express_validator_1.check)('email')
            .notEmpty()
            .isEmail()
            .run(request);
        if (checkUserId.context.errors.length > 0) {
            return response.status(406).json({
                error: 'incorrect parameters'
            });
        }
        try {
            const [resultCheckUser] = await getUserModels_1.default.getUserRegister(email);
            if (resultCheckUser.profile === 'Admin') {
                const resultUpdate = await getTasksModel_1.default.getTasksAll(page, pageSize, order, orderBy);
                return response.status(200).json({
                    body: resultUpdate
                });
            }
            else {
                return response.status(203).json({ error: 'user not allowed' });
            }
        }
        catch (error) {
            return response.status(500).json({ error });
        }
    }
    async ViewAllTaskLate(request, response) {
        const { email, page, pageSize, order, orderBy } = request.query;
        const errors = (0, express_validator_1.validationResult)(request);
        if (!errors.isEmpty()) {
            return response.status(422).json({ errors: errors.array() });
        }
        if (!email) {
            return response.status(404).json({ body: 'missing information' });
        }
        const checkUserId = await (0, express_validator_1.check)('email')
            .notEmpty()
            .isEmail()
            .run(request);
        if (checkUserId.context.errors.length > 0) {
            return response.status(406).json({
                error: 'incorrect parameters'
            });
        }
        try {
            const [resultCheckUser] = await getUserModels_1.default.getUserRegister(email);
            if (resultCheckUser.profile === 'Admin') {
                const resultUpdate = await getTasksModel_1.default.getTasksAllLate(page, pageSize, order, orderBy);
                return response.status(200).json({
                    body: resultUpdate
                });
            }
            else {
                return response.status(203).json({ error: 'user not allowed' });
            }
        }
        catch (error) {
            return response.status(500).json({ error });
        }
    }
}
exports.default = new ViewTasks();
