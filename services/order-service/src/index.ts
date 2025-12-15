import express, { type ErrorRequestHandler } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { randomUUID } from 'node:crypto';
import {
  httpLogger,
  correlationId,
  requireBearer,
  validate,
  CreateOrderSchema,
  errorHandler
} from '../../../utils';

const app = express();

app.use(correlationId);
app.use(helmet());
app.use(httpLogger);

// Handler khusus jika JSON rusak/invalid
app.use(express.json({ limit: '100kb' }));
const jsonParseErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof SyntaxError && 'status' in err && err.status === 400 && 'body' in err) {
    return res.status(400).json({ message: 'Invalid JSON', code: 'BAD_JSON' });
  }
  next();
};
app.use(jsonParseErrorHandler);

app.use(requireBearer);
app.use(rateLimit({ windowMs: 60_000, max: 60, standardHeaders: true, legacyHeaders: false }));

const orders: any[] = [];

app.post('/orders', validate(CreateOrderSchema), (req, res) => {
  const { productId, quantity } = (req as any).validated;
  const order = {
    id: randomUUID(),
    productId,
    quantity,
    createdAt: new Date().toISOString(),
  };
  orders.push(order);
  res.status(201).json(order);
});

app.use(errorHandler);

export default app;