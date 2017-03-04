import Router from 'koa-router';
import drivers from '../controllers/drivers';
import requests from '../controllers/requests';
const router = new Router();

router
  .post('/drivers/', drivers.create)
  .put('/drivers/:id', drivers.update)
  .post('/requests', requests.create)
  .delete('/requests/:id', requests.delete);

export default router;