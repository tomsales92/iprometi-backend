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
const express_1 = require("express");
const prisma_1 = require("../../lib/prisma");
const recordDaysRouter = (0, express_1.Router)();
recordDaysRouter.get('/data/:id', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = request.params;
    const records = yield findManyRecords(id);
    response.json(records);
}));
recordDaysRouter.put('/data/:id', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = request.params;
        const record = yield findRecord(id);
        if (!record) {
            return response.status(404).json({ error: 'Registro não encontrado' });
        }
        const newValueOfmountDatasForUpdate = mountDatasForUpdate(record);
        if (newValueOfmountDatasForUpdate.accomplished > newValueOfmountDatasForUpdate.goal) {
            return response.status(200).json({ message: 'Meta já foi alcançada' });
        }
        const updatedDataResponse = yield updateDataResponse(id, newValueOfmountDatasForUpdate);
        response.json(updatedDataResponse);
    }
    catch (error) {
        console.error('Erro na rota de atualização:', error);
        response.status(500).json({ error: 'Erro interno ao processar a atualização' });
    }
}));
recordDaysRouter.post('/data', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { goal, accomplished, data, colorScheme } = request.body;
        const newData = {
            goal,
            accomplished,
            data: {
                create: data.map(item => ({
                    name: item.name,
                    value: item.value
                }))
            },
            colorScheme: {
                create: colorScheme.map(color => ({
                    name: color.name,
                    value: color.value
                }))
            }
        };
        const { id } = yield prisma_1.prisma.dataResponse.create({
            data: newData,
            include: {
                data: true,
                colorScheme: true,
            },
        });
        response.status(200).json({ message: 'Dados recebidos com sucesso!', id });
    }
    catch (error) {
        console.error('Erro ao criar dados:', error);
        response.status(500).json({ error: 'Erro interno ao criar dados' });
    }
    finally {
        yield prisma_1.prisma.$disconnect();
    }
}));
exports.default = recordDaysRouter;
function mountDatasForUpdate(record) {
    const newAccomplished = record.accomplished + 1;
    const progresso = (newAccomplished / record.goal) * 100;
    const restante = 100 - progresso;
    record.accomplished = newAccomplished;
    record.data[0].value = restante;
    record.data[1].value = progresso;
    return record;
}
function findManyRecords(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma_1.prisma.dataResponse.findUnique({
            where: { id },
            include: {
                data: true,
                colorScheme: true,
            },
        });
    });
}
function findRecord(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma_1.prisma.dataResponse.findFirst({
            where: { id },
            include: {
                data: true,
                colorScheme: true,
            },
        });
    });
}
function updateDataResponse(id, newData) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield prisma_1.prisma.dataResponse.update({
                where: { id },
                data: {
                    goal: newData.goal,
                    accomplished: newData.accomplished,
                    data: {
                        update: newData.data.map((item) => ({
                            where: { id: item.id },
                            data: {
                                name: item.name,
                                value: item.value,
                            },
                        })),
                    },
                    colorScheme: {
                        update: newData.colorScheme.map((item) => ({
                            where: { id: item.id },
                            data: {
                                name: item.name,
                                value: item.value,
                            },
                        })),
                    },
                },
            });
            // Aqui você pode retornar uma mensagem de sucesso
            return { message: 'Dados registrados com sucesso.' };
        }
        catch (error) {
            console.error('Erro ao atualizar o registro:', error);
            throw error;
        }
        finally {
            yield prisma_1.prisma.$disconnect();
        }
    });
}
