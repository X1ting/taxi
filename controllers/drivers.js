import Driver from '../models/driver';
import mongoose from 'mongoose';

const drivers = {
  create: async (ctx, next) => {
    const { lat, long, name } = ctx.request.body;
    ctx.body = await new Driver({loc: [lat, long], name}).save();
    console.log(`Driver ${name} created!`);
    ctx.status = 201;
  },
  update: async (ctx, next) => {
    const { params: { id }, request: { body: { lat, long } } } = ctx;
    let driver;
    if (mongoose.Types.ObjectId.isValid(id)) {
      driver = await Driver.findById(id).exec();
    }
    console.log(`Find driver ${id} for update`);
    if (driver) {
      await driver.update({loc: [lat, long], available: true});
      console.log(`Success found ${id} and updated`);
      ctx.body = `Success updated driver ${id}`;
      ctx.status = 200;
    }
    else {
      console.log(`Driver ${id} not found`);
      ctx.body = 'Not Found';
      ctx.status = 404;
    }
  }
}

export default drivers;