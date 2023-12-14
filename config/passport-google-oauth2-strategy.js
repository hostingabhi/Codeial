const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');
const env = require('./environment');

passport.use(new GoogleStrategy({
    clientID: env.google_client_id,
    clientSecret: env.google_client_secret,
    callbackURL: env.google_call_back_url
},
async function(accessToken, refreshToken, profile, done) {
    try {
        const user = await User.findOne({ email: profile.emails[0].value });

        console.log(profile);

        if (user) {
            return done(null, user);
        } else {
            const newUser = await User.create({
                name: profile.displayName,
                email: profile.emails[0].value,
                password: crypto.randomBytes(20).toString('hex')
            });
            return done(null, newUser);
        }
    } catch (err) {
        console.log('Error in google strategy-passport', err);
        return done(err);
    }
}));

module.exports = passport;
