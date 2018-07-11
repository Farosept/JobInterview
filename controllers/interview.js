var util = require('util');
var ffmpeg = require('fluent-ffmpeg');
var express = require('express');
var router = express.Router();
var question = require('../models/question');
var material = require('../models/material');
var vacancy = require('../models/vacancy');
var materialFile = require('../models/material_file');
var mqt = require('../models/material_question_time');
var moment = require('moment');
var ebml = require('ts-ebml');
router.post('/', function (req, res) { //доступ к видео
    var vacancy_id = req.body.vacancy_id;
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    var email = req.body.email;
    var phone = req.body.phone;
    var material_id = req.body.material_id;
    var attempt_number = req.body.attempt_number;
    req.checkBody('first_name', 'Поле "Имя" не может быть пустым').notEmpty();
    req.checkBody('last_name', 'Поле "Фамилия" не может быть пустым').notEmpty();
    req.checkBody('email', 'Введён не корректный email').isEmail();
    req.checkBody('email', 'Поле "Email" не может быть пустым').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        res.send({
            errors
        });
        return;
    }
    var vacancy_title = req.body.vacancy_title;
    var candidate = {
        vacancy_id: vacancy_id,
        first_name: first_name,
        last_name: last_name,
        email: email,
        phone: phone
    };
    vacancy.getById(vacancy_id, (err, vacancy) => {
        material.find(candidate, (err, find) => {
            if (find.length == 0) {
                material.add(candidate, (err, add) => {
                    if (err) console.log(err);
                    res.render('interview',
                        {
                            vacancy_title,
                            candidate,
                            vacancy: vacancy,
                            material_id: add.insertId,
                            attempt_number: 1
                        });
                });
            } else {
                mqt.getCountAttempts(find[0].material_id, (err, attempt) => {
                    if (err) console.log(err);
                    if (attempt[0].count == global.attempts) {
                        if (req.user) {
                            var user = { username: req.user[0].login }
                        }
                        else user = null
                        res.render('err', {
                            user
                        })
                    } else {
                        res.render('interview',
                            {
                                vacancy_title,
                                candidate,
                                vacancy: vacancy,
                                material_id: find[0].material_id,
                                attempt_number: attempt[0].count + 1
                            });

                    }
                });

            }
        });
        return;
    });
});
router.post('/check', (req, res) => {
    var vacancy_id = req.body.vacancy_id;
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    var email = req.body.email;
    var phone = req.body.phone;
    var candidate = {
        vacancy_id: vacancy_id,
        first_name: first_name,
        last_name: last_name,
        email: email,
        phone: phone
    };
    req.checkBody('first_name', 'Поле "Имя" не может быть пустым').notEmpty();
    req.checkBody('last_name', 'Поле "Фамилия" не может быть пустым').notEmpty();
    req.checkBody('email', 'Введён не корректный email').isEmail();
    req.checkBody('email', 'Поле "Email" не может быть пустым').notEmpty();
    if(phone!='')
    req.checkBody('phone', 'Номер телефона не должен содержать букв').isMobilePhone("ru-RU");
    var errors = req.validationErrors();
    if (errors) {
        res.status('422').send({
            errors
        });
        return;
    }


    material.find(candidate, (err, find) => {
        if (find.length == 0) {
            material.add(candidate, (err, add) => {
                if (err) console.log(err);
                res.send({ material_id: add.insertId, attempt_number: 1 });
            });
        } else {
            mqt.getCountAttempts(find[0].material_id, (err, attempt) => {
                if (err) console.log(err);
                if (attempt[0].count == global.attempts) {
                    var errors = [];
                    errors.push({ msg: "Извините ваши попытки закончились." })
                    res.status('422').send({ errors: errors });
                } else {
                    res.send({ material_id: find[0].material_id, attempt_number: attempt[0].count + 1 });
                }
            });

        }
    });
});

router.post('/spent', (req, res) => {
    mqt.add({
        material_id: req.body.material_id,
        question_id: req.body.question_id,
        spent_time: req.body.time,
        number: req.body.number,
        start_time: req.body.start_time,
        end_time: req.body.end_time,
        attempt_number: req.body.attempt_number
    });
    res.end();
});
router.post('/finish', function (req, res) {
    var vacancy_id = req.body.vacancy_id,
        first_name = req.body.first_name,
        last_name = req.body.last_name,
        email = req.body.email,
        phone = req.body.phone,
        files = req.files,
        file = util.inspect(files),
        material_id = req.body.material_id,
        attempt_number = req.body.attempt_number,
        date_upload = new Date();
    file_path = file.split('path: \'')[1].split('\',')[0].toString().replace(/\\/g, '/');

    var Material = {
        file_path: "/" + file_path,
        file_type: 1,
        vacancy_id: vacancy_id,
        date_viwed: null,
        status: 1,
        first_name: first_name,
        last_name: last_name,
        email: email,
        phone: phone,
        date_upload: date_upload
    };
    material.update(material_id, Material, (err, result) => {
        if (err) console.log(err);
    });
    materialFile.add({ material_id: material_id, file_path: "/" + file_path, attempt_number: attempt_number });
    res.end();
});
router.get('/questions/:id', function (req, res) {
    question.getRand(req.params.id, function (err, result) {
        var json = JSON.stringify(result)
        res.send({
            questions: result
        });
    });
});



module.exports = router