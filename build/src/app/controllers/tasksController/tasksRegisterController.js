"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const insertTasksModel_1 = __importDefault(require("@models/tasksModel/insertTasksModel"));
class RegisterTasks {
    async RegisterTasksUser(request, response) {
        const { description, status, deadline, user_id } = request.body;
        const errors = (0, express_validator_1.validationResult)(request);
        if (!errors.isEmpty()) {
            return response.status(422).json({ errors: errors.array() });
        }
        if (!description || !status || !deadline || !user_id) {
            return response.status(404).json({ body: 'missing information' });
        }
        const checkDeadline = await (0, express_validator_1.check)('deadline')
            .notEmpty()
            .isISO8601().toDate()
            .run(request);
        const checkUserId = await (0, express_validator_1.check)('user_id')
            .notEmpty()
            .isNumeric()
            .run(request);
        const checkStatus = await (0, express_validator_1.check)('status')
            .notEmpty()
            .custom((value) => {
            const validUserTypes = [
                'Todo',
                'Done'
            ];
            return validUserTypes.includes(value);
        })
            .run(request);
        if (checkDeadline.context.errors.length > 0 ||
            checkUserId.context.errors.length > 0 ||
            checkStatus.context.errors.length > 0) {
            return response.status(406).json({
                error: 'incorrect parameters'
            });
        }
        try {
            const resultInsert = await insertTasksModel_1.default.insertUserTask(description, status, deadline, user_id);
            if (resultInsert.length > 0) {
                return response.status(200).json({
                    body: resultInsert[0]
                });
            }
            else {
                return response.status(500).json({ error: 'error registering user' });
            }
        }
        catch (error) {
            return response.status(500).json({ error });
        }
    }
}
exports.default = new RegisterTasks();
