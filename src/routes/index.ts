import express from 'express';
import { images } from './api';
const routes = express.Router();

routes.use('/images', images);

routes.get('/', (req, res) => {
  res.send('Home route');
});

export default routes;
