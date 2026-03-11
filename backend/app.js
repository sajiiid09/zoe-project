import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import userRoutes from './routes/userRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import vendorRoutes from './routes/vendorRoutes.js';
import affiliateRoutes from './routes/affiliateRoutes.js';
import vendorSubmissionRoutes from './routes/vendorSubmissionRoutes.js';
import adminSubmissionRoutes from './routes/adminSubmissionRoutes.js';
import adminCatalogRoutes from './routes/adminCatalogRoutes.js';
import catalogRoutes from './routes/catalogRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

export const healthHandler = (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    data: {
      status: 'OK',
      timestamp: new Date().toISOString(),
    },
  });
};

export const notFoundHandler = (req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
};

export const createApp = () => {
  const app = express();

  app.set('trust proxy', 1);

  const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:3000')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

  app.use(cors({
    origin: (origin, callback) => {
      // Allow server-to-server requests (SSR, Postman, curl) that have no Origin header
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS: origin '${origin}' not allowed`));
    },
    credentials: true,
  }));

  app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use('/api/products', productRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/payments', paymentRoutes);
  app.use('/api/vendor', vendorRoutes);
  app.use('/api/affiliate', affiliateRoutes);
  app.use('/api/vendor/submissions', vendorSubmissionRoutes);
  app.use('/api/admin/submissions', adminSubmissionRoutes);
  app.use('/api/admin/catalog', adminCatalogRoutes);
  app.use('/api/catalog', catalogRoutes);

  app.get('/api/health', healthHandler);

  app.use(notFoundHandler);

  app.use(errorHandler);

  return app;
};

const app = createApp();

export default app;
