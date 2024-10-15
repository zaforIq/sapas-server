import express from 'express';
import middlewares from './middlewares/index.js';
import routes from './middlewares/routes.js';

const app = express();

middlewares(app);
routes(app);

export default app;