const mongoose = require('mongoose');
const env = require('./environment');

const mongoConnectionString = process.env.MONGO_CONNECTION_STRING || `mongodb+srv://abhishekprajapat423:czLJg7Vu81pypDeA@codeial.ol7pbzh.mongodb.net/codeial_development`;

mongoose.connect(mongoConnectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error connecting to MongoDB'));

db.once('open', function () {
  console.log('Connected to Database :: MongoDB');
});

module.exports = db;
