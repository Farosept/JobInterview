var bcrypt = require('bcrypt'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    express = require('express'),
    user = require('../models/user'),
    router = express.Router();

passport.serializeUser(function (user, done) {
    done(null, user[0].user_id);
});

passport.deserializeUser(function (id, done) {
    user.getUserById(id, (err, result) => {
        done(err, result);
    });
});

passport.use('local', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
},
    function (req, email, password, done) { // callback with email and password from our form
        user.getUser(email, (err, result) => {
            if (err)
                return done(err);
            if (!result) {
                return done(null, false, req.flash('error', 'Пользователь не найден'));
            }
            if (!bcrypt.compareSync(password, result[0].password)) {
                return done(null, false, req.flash('error', 'Не правильный пароль'));
            }
            return done(null, result);
        });
    }));

router.get('/login', function (req, res) {
    res.render('auth', { errors: req.flash('error') });
});

router.post('/login', passport.authenticate('local', {
    failureRedirect: '/auth/login',
    failureFlash: true

}), function (req, res) {
    res.cookie('userid', req.sessionID, { maxAge: 10 * 64 * 10000 });
    res.redirect('/requests')
});

router.get('/logout', function (req, res) {
    if (!req.isAuthenticated) {
        res.send({
            error: true,
            msg: 'Вы не авторизированы'
        });
        return;
    }
    res.clearCookie('userid');
    req.logout();
    res.redirect("/");
    return;
});

module.exports = router