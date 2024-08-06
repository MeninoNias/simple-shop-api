import express from 'express';
import 'dotenv/config'

import { router } from './routes';

const server = express();

server.use(express.json());

server.use('/api', router);

export { server };