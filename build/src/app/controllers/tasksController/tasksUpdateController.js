"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const updateTasksModel_1 = __importDefault(require("@models/tasksModel/updateTasksModel"));
const getTasksModel_1 = __importDefault(require("@models/tasksModel/getTasksModel"));
class UpdateTasks {
    async FinishTaskUser(request, response) {
        const { idTask } = request.body;
        const errors = (0, express_validator_1.validationResult)(request);
        if (!errors.isEmpty()) {
            return response.status(422).json({ errors: errors.array() });
        }
        if (!idTask) {
            return response.status(404).json({ body: 'missing information' });
        }
        const checkUserId = await (0, express_validator_1.check)('idTask')
            .notEmpty()
            .isNumeric()
            .run(request);
        if (checkUserId.context.errors.length > 0) {
            return response.status(406).json({
                error: 'incorrect parameters'
            });
        }
        try {
            const resultUpdate = await updateTasksModel_1.default.finishUserTask(idTask);
            if (resultUpdate) {
                return response.status(200).json({
                    body: 'successfully completed'
                });
            }
            else {
                return response.status(500).json({ error: 'error update task user' });
            }
        }
        catch (error) {
            return response.status(500).json({ error });
        }
    }
    async UpdateTaskUser(request, response) {
        const { idTask, description, deadline } = request.body;
        const errors = (0, express_validator_1.validationResult)(request);
        if (!errors.isEmpty()) {
            return response.status(422).json({ errors: errors.array() });
        }
        if (!idTask || !description || !deadline) {
            return response.status(404).json({ body: 'missing information' });
        }
        const checkUserId = await (0, express_validator_1.check)('idTask')
            .notEmpty()
            .isNumeric()
            .run(request);
        const checkDeadline = await (0, express_validator_1.check)('deadline')
            .notEmpty()
            .isISO8601().toDate()
            .run(request);
        if (checkUserId.context.errors.length > 0 || checkDeadline.context.errors.length > 0) {
            return response.status(406).json({
                error: 'incorrect parameters'
            });
        }
        try {
            const [resultCheckStatus] = await getTasksModel_1.default.getTaskFilterId(idTask);
            if (resultCheckStatus.finished_at === null) {
                const resultUpdate = await updateTasksModel_1.default.updateUserTask(idTask, description, deadline);
                if (resultUpdate) {
                    return response.status(200).json({
                        body: 'successfully completed'
                    });
                }
                else {
                    return response.status(500).json({ error: 'error update task user' });
                }
            }
            else {
                return response.status(203).json({ error: 'This action cannot be performed. Task already completed' });
            }
        }
        catch (error) {
            return response.status(500).json({ error });
        }
    }
}
exports.default = new UpdateTasks();
