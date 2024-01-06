import express, { Request, Response, response } from 'express';
import { DataResponse } from './models/data-response';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors());

app.use(express.json());

let  futuroBanco: DataResponse = new DataResponse();

app.get('/teste', (req: Request, res: Response) => {
  const responde = futuroBanco;
  res.send({"message": "teste"});
});

app.get('/data', (req: Request, res: Response) => {
  const responde = futuroBanco;
  res.send(futuroBanco);
});

app.patch('/data', (req, res) => {
  const { diasRealizados } = req.body;
  
  if (diasRealizados !== undefined) {
    futuroBanco.diasRealizados = diasRealizados;
  }

  const progresso = (diasRealizados / futuroBanco.meta) * 100;
  const restante  = 100 - progresso;

  console.log(progresso)
  console.log(restante)
   futuroBanco.dados[0].value = restante;
   futuroBanco.dados[1].value = progresso;
  res.json(futuroBanco);
});

// Rota POST de exemplo para receber dados
app.post('/data', (req: Request, res: Response) => {
  const data = req.body;
  futuroBanco = data;
  console.log('Dados recebidos:', futuroBanco);
  res.status(200).json({ message: 'Dados recebidos com sucesso!' });
});

// Iniciando o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});


