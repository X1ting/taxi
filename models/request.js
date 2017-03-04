import mongoose from 'mongoose';
import redis from 'redis';
import Driver from './driver';
const subscriber = redis.createClient();
const publisher = redis.createClient();

subscriber.psubscribe('__key*__:*')

subscriber.on('pmessage', async (channel, message) => {
  const [_, id] = message.split('__:');
  // Here need check for ttl is expired and about event type. But is boring.
  console.log(`Time to perform request ${id}`);
  const request = await mongoose.model('Request').findById(id).exec();
  const driver = await Driver.findSuitable(request.loc);
  if (driver) {
    await driver.update({available: false});
    console.log(`For user ${request.passenger.name} suit driver ${driver.name} by deffered task`);
  }
  else {
    console.log(`Unfortunately we haven't free drivers for deferred task ${id}, try later`);
  }

})

const requestSchema = new mongoose.Schema({
  id: mongoose.Schema.ObjectId,
  passenger: {
    id: Number,
    name: String,
  },
  time: Date,
  loc: {
    type: [Number], //[longitude, latitude]
    index: '2d'
  },
})

requestSchema.post('save', async function() {
  const { _id: id, passenger: { name }, time } = this;
  publisher.set(id.toString(), name);
  publisher.expireat(id.toString(), parseInt((+new Date(time)) / 1000, 10));
  console.log(`For request - ${id} for passenger ${name} was setted time ${time}`)
})

requestSchema.statics.delete = async function(id) {
  console.log(`Delete ${id} request`);
  this.findById(id).remove().exec();
  publisher.del(id);
}

mongoose.Promise = global.Promise;
export default mongoose.model('Request', requestSchema)