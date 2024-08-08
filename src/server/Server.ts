import express from 'express';
import 'dotenv/config'

import './shared/services/TranslationsYup';
import { router } from './routes';
import { JSONParseError } from './shared/exception/JSONParseError';
import { PrismaParseError } from './shared/exception/PrismaParseError';

const server = express();

server.use(express.json());

server.use('/api', router);

server.use(JSONParseError);
server.use(PrismaParseError);

export { server };