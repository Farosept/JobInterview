var express = require('express'),
    vacancy = require('../models/vacancy'),
    router = express.Router(),
    fs = require('fs');

router.use('/auth', require('./auth'));
router.use('/requests', require('./requests'));
router.use('/interview', require('./interview'));
router.use('/resume', require('./resume'));
router.use('/admin', require('./admin'));

router.get('/', function (req, res) {
    if (req.user) {
        var user = { username: req.user[0].login }
    } else {
        user = null
    }
    vacancy.getAll(function (err, result) {
        res.render('index', {
            errors: null,
            vacancies: result,
            user: user
        });
    });
});


module.exports = router