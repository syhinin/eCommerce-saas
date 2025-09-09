import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';

//TODO fix errorMiddleware and swaggerDocument imports
import { errorMiddleware } from '@error-handler';
import router from './routes/auth.routes';
import swaggerDocument from './swagger-output.json' with { type: 'json' };

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 6001;

const app = express();

// Enable CORS for frontend (running on localhost:3000)
app.use(
  cors({
    origin: ['http://localhost:3000'],
    allowedHeaders: ['Authorization', 'Content-type'],
    credentials: true,
  })
);

// Parse JSON and URL-encoded request bodies (with size limits)
app.use(express.json({ limit: '100mb' }));

// Parse cookies
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send({ message: 'Hello API' });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// Routes
app.use('/api', router);

app.use(errorMiddleware);

const server = app.listen(port, host, () => {
  console.log(`Auth service is running at http://${host}:${port}/api`);
});

server.on('error', (error) => {
  console.log('Server error: ', error);
});
