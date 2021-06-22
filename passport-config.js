const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('./models/user');

function initPassport(passport) {

    const authenticateUser = async (username, password, done) => {
        const user = await User.findOne({ username });
        if (user == null) {
            return done(null, false, { message: "Wrong Username or Password" })
        }

        try {

            const match = await bcrypt.compare(password, user.password);
            if (match) {
                return done(null, user);
            }
            else {
                return done(null, false, { message: "Wrong Username or Password" });
            }

        } catch (error) {
            return done(error);
        }
    }

    passport.use(new LocalStrategy({ usernameField: 'username' }, authenticateUser))

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });
}

module.exports = initPassport;