const mongoose = require('mongoose');
const env = require('./environment');

// mongoose.connect(`mongodb://127.0.0.1/${env.db}`);
mongoose.connect(`mongodb+srv://abhishekprajapat423:czLJg7Vu81pypDeA@codeial.ol7pbzh.mongodb.net/?retryWrites=true&w=majority`);


const db = mongoose.connection;

db.on('error',console.error.bind(console,"error connecting to MongoDB"));

db.once('open',function(){
    console.log('Connected to Database :: MongoDB');
});
module.exports = db;