import request from 'request';

const NAMES = [
  'Petya', 'Kolya', 'Azat', 'Ararat', 'Medeya', 'Finik', 'Alexandr', 'FuBar'
]
const appAddress = 'http://localhost:3000';

Array.prototype.randomElement = function () {
    return this[Math.floor(Math.random() * this.length)]
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function addSeconds(date, seconds) {
  return new Date(date.getTime() + seconds * 1000);
}

// Preparing ( create taxi drivers )
console.log('Create taxi drivers');
const driverIds = [];
for (let index = 0; index < 20; index++) {
  const name = NAMES.randomElement();
  const body = {
    lat: getRandomInt(10,100),
    long: getRandomInt(10,100),
    name: name,
  }
  request({
    url: `${appAddress}/drivers`,
    method: 'POST',
    json: body,
  }, (err, response, body) => {
    if (err) {
      console.error('failed', err);
    }
    else {
      driverIds.push(body["_id"])
      console.log(`Create ${index + 1} driver ${name}`);
    }
  })
}

function updateDriver(driverId) {
  request({
    url: `${appAddress}/drivers/${driverId}`,
    method: 'PUT',
    json: {
      lat: getRandomInt(10, 100),
      long: getRandomInt(10, 100),
    }
  }, (err, response, body) => {
    if (err) {
      console.error('Failed update taxi', err)
    }
    else {
      console.log(body);
    }
  })
}

function createPassengerRequest(delayed = false) {
  const body = {
    passenger: {
      id: getRandomInt(0, 1000000),
      name: NAMES.randomElement(),
    },
    lat: getRandomInt(10, 100),
    long: getRandomInt(10, 100),
    time: delayed ? addSeconds(new Date(), getRandomInt(20, 180)) : null
  };
  request({
    url: `${appAddress}/requests`,
    method: 'POST',
    json: body,
  }, (err, response, body) => {
    if (err) {
      console.error('Failed create passenger', err)
    }
    else {
      console.log(body);
    }
  })
}

setInterval(() => {
  setTimeout(() => {
    createPassengerRequest()
  }, getRandomInt(500, 1500))
}, getRandomInt(1000, 5000))


setInterval(() => {
  setTimeout(() => {
    createPassengerRequest(true)
  }, getRandomInt(500, 1500))
}, getRandomInt(5000, 15000))

setInterval(() => {
  setTimeout(() => {
    updateDriver(driverIds.randomElement())
  }, getRandomInt(500, 1500))
}, getRandomInt(15000, 25000))