const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');


const logDirectory = path.join(__dirname, '../production_logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream('access.log', {
    interval: '1d',
    path: logDirectory
});

const development = {
    name: 'development',
    db: 'codeial_development',
    //session_cookie_key: 'aesx6IdNXY3HTeGlO6Grb6FEniQtkZyi',
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'abhishekprajapat423@gmail.com',
            pass: 'dmclyzjnevwmwpzl'
        }
    },
    google_client_id: "26421268233-om1sfbnmuhopveg5vuguonvr5u4omq1v.apps.googleusercontent.com",
    google_client_secret: "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",
    google_call_back_url: "http://localhost:8000/users/auth/google/callback",
    session_cookie_key: 'XP9ag56FimMecugjIkzaCFFlLphVCrhk',
    morgan: {
        mode: 'dev',
        options: { stream: accessLogStream }
    }
}

const production = {
    name: 'production',
    session_cookie_key: process.env.CODEIAL_SESSION_COOKIE_KEY,
    morgan: {
        mode: 'combined',
        options: { stream: accessLogStream }
    }
}

module.exports = development;
// module.exports = eval(process.env.CODEIAL_ENVIRONMENT) == undefined ? development : eval(process.env.CODEIAL_ENVIRONMENT);

