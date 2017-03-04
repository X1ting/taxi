import Request from '../models/request';
import Driver from '../models/driver';

const request = {
  create: async (ctx, next) => {
    const { passenger: { id, name }, lat, long, time } = ctx.request.body;
    if (time) {
      const request = await new Request({passenger: { name, id }, loc: [long, lat], time}).save();
      ctx.body = `Request saved, and will be invoked at ${time}`;
      ctx.status = 200;
    }
    else {
      const driver = await Driver.findSuitable([long, lat]);

      if (driver) {
        await driver.update({available: false});
        ctx.body = `For user ${name} suit driver ${driver.name}`;
        ctx.status = 200;
      }
      else {
        ctx.body = `Unfortunately we haven't free drivers, try later`
        ctx.status = 404;
      }

    }
  },
  delete: async (ctx, next) => {
    const { id } = ctx.params;
    await Request.delete(id);
    ctx.status = 200;
  }
}
export default request;
