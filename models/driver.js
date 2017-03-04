import mongoose from 'mongoose';

const driverSchema = new mongoose.Schema({
  id: mongoose.Schema.ObjectId,
  name: String,
  loc: {
    type: [Number], //[longitude, latitude]
    index: '2d'
  },
  available: {
    type: Boolean,
    default: true,
  },
})
driverSchema.statics.findSuitable = async function(loc) {
  console.log(`Find suitable driver for ${loc}`)
  const driver = await this.findOne({
    loc: {
      $near: loc,
      $maxDistance: 15000000,
    },
    available: true
  }).exec();
  return driver;
}

mongoose.Promise = global.Promise;
export default mongoose.model('Driver', driverSchema)