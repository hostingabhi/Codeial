const express =  require('express');
const env = require('./config/environment');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const app = express();
require('./config/view-helpers')(app);
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('./config/mongoose')
//used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passpoer-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');
const MongoStore = require('connect-mongo');

const flash = require('connect-flash');
const customMware = require('./config/middleware')
const passportGoogle = require('./config/passport-google-oauth2-strategy');

// setup the chat server to be used with socket.io
const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000);
console.log('chat server is listening on port 5000');
const path = require('path')

// const sassMiddleware = require('node-sass-middleware');

// app.use(sassMiddleware({
//     src: path.join(__dirname, env.asset_path, 'scss'),
//     dest: path.join(__dirname, env.asset_path,'css'),
//     debug: true,
//     outputStyle:'extended',
//     prefix : '/css'
// }));
app.use(express.urlencoded());

app.use(cookieParser());

app.use(express.static(path.join(__dirname, '/public/assets' )));
app.use('/uploads', express.static(__dirname + '/uploads'));

const fs = require('fs');
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

app.use(logger('dev', { stream: accessLogStream }));

app.use(expressLayouts);
//extract style and scripts from sub pages into the layout
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);
//set up the view engine
app.set('view engine','ejs');
app.set('views','./views');


//mongo store is used to store the session cookie in the db
app.use(session({
    name: 'codeial',
    //todo change the secret before deployment in production mode
    secret: env.session_cookie_key,
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge : (1000 * 60 * 100)
    },
    store: MongoStore.create(
        {
            mongoUrl : process.env.MONGO_CONNECTION_STRING || "mongodb+srv://abhishekprajapat423:czLJg7Vu81pypDeA@codeial.ol7pbzh.mongodb.net/codeial_development" ,
            autoRemove: 'disabled'
        },
        function(err){
            console.log(err || 'connect-mongodb setup ok');
        }
    )
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setFlash);


//use Express router
app.use('/', require('./routes'));


app.listen(port, function(err){
    if(err){
        console.log(`Error in running the server : ${err}`);
    }
    console.log(`Server is running on port: ${port}`);
});