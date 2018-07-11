var express = require('express'),
    router = express.Router(),
    isAuthenticated = require('./isAuthenticated'),
    vacancy = require('../models/vacancy'),
    question = require('../models/question');

router.post('/add', isAuthenticated, function (req, res) {
    var title = req.body.title,
        description = req.body.description,
        total = parseInt(req.body.total),
        quantity = parseInt(req.body.quantity),
        questions = [],
        errors = [];
    req.checkBody('title', 'Поле название не может быть пустым').notEmpty();
    req.checkBody('description', 'Поле описание не может быть пустым').notEmpty();
    if (req.validationErrors()) {
        errors = req.validationErrors();
    }
    if (quantity && total) {
        if (quantity > total) {
            errors.push({
                msg: 'Количество отображаемых впросов должно быть не больше количества вопросов'
            });
        }
    }
    if (errors.length > 0) {
        res.status('422').send(errors);
        return;
    }
    vacancy.add({ title: title, description: description, quantity_questions: quantity || null }, (err, result) => {
        if (err) { console.log(err); return; }
        for (var i = 1; i < total + 1; i++) {
            if (req.body['time' + i]) {
                questions.push([req.body['question' + i], req.body['time' + i], result.insertId]);
            }
        }
        if (questions.length > 0) {
            question.add(questions);
        }
        res.send("ok");
    });
});

router.post('/update', isAuthenticated, function (req, res) {
    var title = req.body.title,
        description = req.body.description,
        vacancy_id = req.body.vacancy_id,
        total = parseInt(req.body.total),
        quantity = parseInt(req.body.quantity) || null,
        questions = [],
        errors = [];
    req.checkBody('title', 'Поле название не может быть пустым').notEmpty();
    req.checkBody('description', 'Поле описание не может быть пустым').notEmpty();
    if (req.validationErrors()) {
        errors = req.validationErrors();
    }
    if (quantity && total) {

        if (quantity > total) {
            errors.push({
                error: true,
                msg: 'Количество отображаемых впросов должно быть не больше количества вопросов'
            });
        }
    }
    if (errors.length > 0) {
        res.status('422').send(errors);
        return;
    }
    vacancy.update({ title: title, description: description, quantity_questions: quantity }, vacancy_id, (err, result) => {
        if (err) { console.log(err); return; }
        for (var i = 1; i < total + 1; i++) {
            question.update({ question_text: req.body['question' + i], question_time: req.body['time' + i] }, req.body['qid' + i])
        }
        if (req.body.addquestions) {
            req.body.addquestions[0].split(',').forEach(element => {
                questions.push([req.body['question' + element], req.body['time' + element], vacancy_id]);
            });
            question.add(questions);
        }
        if (req.body.delquestions) {
            req.body.delquestions[0].split(',').forEach(element => {
                question.delete(element);
            });
        }
        res.redirect('/')
    });
});

router.get('/questions/:id', isAuthenticated, function (req, res) {
    question.getAll(req.params.id, (err, result) => {
        res.send(result);
    })
});

router.post('/deletevacancy/', isAuthenticated, (req, res) => {
    question.getCount(req.body.id, (err, result) => {
        if (err) { console.log(err); return; }
        if (result[0]['count(*)'] > 0) {
            question.deleteByVacancyId(req.body.id, (err, result) => {
                if (err) { console.log(err); return; }
                vacancy.delete(req.body.id);
                res.redirect('/');
            });
        } else {
            vacancy.delete(req.body.id);
            res.redirect('/');
        }
    });
});

module.exports = router