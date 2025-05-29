import { configure } from '@codegenie/serverless-express';
import app from './app';

export const handler = configure({ app });