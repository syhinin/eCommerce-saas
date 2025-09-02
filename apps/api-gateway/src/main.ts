import express from 'express';
import * as path from 'path';
import cors from 'cors';
import proxy from 'express-http-proxy';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { rateLimit, ipKeyGenerator } from 'express-rate-limit';
import axios from 'axios';
import cookieParser from 'cookie-parser';

const app = express();

// Enable CORS for frontend (running on localhost:3000)
app.use(
  cors({
    origin: ['http://localhost:3000'],
    allowedHeaders: ['Authorization', 'Content-type'],
    credentials: true,
  })
);

// Log HTTP requests in development format
app.use(morgan('dev'));

// Parse JSON and URL-encoded request bodies (with size limits)
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// Parse cookies
app.use(cookieParser());

// Trust proxy headers
app.set('trust proxy', 1);

// Apply rate limiting per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: (req: any) => (req.user ? 1000 : 100),
  // → 100 requests per 15 min for unauthenticated users
  // → 1000 requests per 15 min for authenticated users
  message: { error: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: true,
  keyGenerator: (req: any) => ipKeyGenerator(req.ip),
});
app.use(limiter);

// Proxy requests to backend service
app.use('/', proxy('http://localhost:6001'));

app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Health check endpoint
app.get('/gateway-health', (req, res) => {
  res.send({ message: 'Welcome to api-gateway!' });
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
