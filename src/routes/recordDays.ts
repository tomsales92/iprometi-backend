import { Router, request, response } from "express";
import { prisma } from "../../lib/prisma";
import { DataResponse } from "../models/data-response";

const recordDaysRouter = Router();


  recordDaysRouter.get('/data/:id', async (request, response) => {
    const { id } = request.params;
    const records = await findManyRecords(id);
    response.json(records);
  });
  
  recordDaysRouter.put('/data/:id', async (request, response) => {
    try {
      const { id } = request.params;
      const record = await findRecord(id); 
  
      if (!record) {
        return response.status(404).json({ error: 'Registro não encontrado' });
      }
      const newValueOfmountDatasForUpdate = mountDatasForUpdate(record);

      if(newValueOfmountDatasForUpdate.accomplished > newValueOfmountDatasForUpdate.goal){
         return response.status(200).json({ message: 'Meta já foi alcançada' });
      }
       
      const updatedDataResponse = await updateDataResponse(id, newValueOfmountDatasForUpdate);
      response.json(updatedDataResponse);
    } catch (error) {
      console.error('Erro na rota de atualização:', error);
      response.status(500).json({ error: 'Erro interno ao processar a atualização' });
    }
  });
  
  recordDaysRouter.post('/data', async (request, response) => {
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
      const { id } = await prisma.dataResponse.create({
        data: newData,
        include: {
          data: true,
          colorScheme: true,
        },
      });
      response.status(200).json({ message: 'Dados recebidos com sucesso!', id });
    } catch (error) {
      console.error('Erro ao criar dados:', error);
      response.status(500).json({ error: 'Erro interno ao criar dados' });
    } finally {
      await prisma.$disconnect();
    }
  });

  export default recordDaysRouter;

function mountDatasForUpdate (record: DataResponse) {

  const newAccomplished = record.accomplished + 1;
  const progresso = (newAccomplished / record.goal) * 100;
  const restante = 100 - progresso;

  record.accomplished = newAccomplished;
  record.data[0].value = restante;
  record.data[1].value = progresso;

  return record;
}

async function findManyRecords(id) {
  return await prisma.dataResponse.findUnique({
    where: {id},
    include: {
      data: true,
      colorScheme: true,
    },
  });
}

async function findRecord(id: string) {
  return await prisma.dataResponse.findFirst({
    where: { id },
    include: {
      data: true,
      colorScheme: true,
    },
  });
}

async function updateDataResponse(id: string, newData: any) {
  try {
    await prisma.dataResponse.update({
      where: { id },
      data: {
        goal: newData.goal,
        accomplished: newData.accomplished,
        data: {
          update: newData.data.map((item: any) => ({
            where: { id: item.id },
            data: {
              name: item.name,
              value: item.value,
            },
          })),
        },
        colorScheme: {
          update: newData.colorScheme.map((item: any) => ({
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
  } catch (error) {
    console.error('Erro ao atualizar o registro:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
