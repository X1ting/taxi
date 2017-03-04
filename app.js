import Koa from'koa';
import bodyParser from 'koa-bodyparser';
import mongoose from 'mongoose';

import router from './middlewares/routes';
import errorHandler from './middlewares/error';
import timeOfRequest from './middlewares/timeOfRequest';
mongoose.connect('mongodb://localhost/taxi_db')

const app = new Koa();

app.use(errorHandler);
// app.use(timeOfRequest);
app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000);