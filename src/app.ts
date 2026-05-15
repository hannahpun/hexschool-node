import express, { type ErrorRequestHandler } from 'express';
import cors from 'cors';
import todoRoutes from '@/routes/todoRoutes.ts';
import { HttpError } from '@/utils/HttpError.ts';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/todos', todoRoutes);
app.use((_, res) => {
  res.status(404).json({
    status: 'error',
    message: '無此路由資訊',
  });
});
const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof HttpError) {
    return res.status(err.status).json({
      status: 'error',
      message: err.message,
    });
  }
  console.log(err);
  res.status(500).json({
    status: 'error',
    message: 'server error',
  });
};
app.use(errorHandler);

app.listen(3000);
