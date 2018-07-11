var express = require('express'),
    isAuthenticated = require('./isAuthenticated'),
    router = express.Router(),
    material = require('../models/material'),
    vacancy = require('../models/vacancy'),
    mqt = require('../models/material_question_time'),
    question = require('../models/question'),
    material_file = require('../models/material_file'),
    moment = require('moment');
const SORT = {
    0: "",
    1: "desc",
    2: "asc"
}
router.get('/video/:id/:attempt', (req, res) => {
    var obj = {
        material_id: req.params.id,
        attempt_number: req.params.attempt
    }
    mqt.getByObj(obj, (err, mqtResult) => {
        material_file.getByMaterialId(obj, (err, fileResult) => {
            if (req.user) {
                var user = { username: req.user[0].login }
            }
            else user = null
            res.render('video', {
                src: fileResult[0] === undefined ? "../public/notfound.bmp": fileResult[0].file_path,
                mqt: mqtResult,
                user
            })
        })
    });
});

router.get('/more/:id', (req, res) => {
    material.getById(req.params.id, (err, materialResult) => {
        mqt.getByMaterialId(materialResult[0].material_id, (err, mqtResult) => {
            mqtResult.forEach(e => {
                var date = moment().startOf('day').seconds(e.time).format('HH:mm:ss')
                e.time = date;
            })
            if (req.user) {
                var user = { username: req.user[0].login }
            }
            else user = null
            res.render('more', {
                material: materialResult[0],
                mqt: mqtResult,
                user: user
            })
        });
    });
});

router.get('/sort/:page', function (req, res) {
    let numRows,
        numPerPage = 10,
        page = parseInt(req.params.page, 10) || 1,
        numPages,
        skip = (page - 1) * numPerPage,
        end_limit = numPerPage,
        limit = skip + ',' + end_limit,
        sortString = getSortString(req);
    material.getCount(function (err, result) {
        material.getPagination(limit, sortString, function (err, result) {
            global.helpers.replaceTime(result);
            res.render('requestsPartial', {
                materials: result,
            });
        });
    });
});
router.get('/', isAuthenticated, function (req, res) {
    let numRows,
        numPerPage = 10,
        page = 1,
        numPages,
        skip = (page - 1) * numPerPage,
        end_limit = numPerPage,
        limit = skip + ',' + end_limit;
    material.getCount(function (err, result) {
        numRows = result[0].numRows;
        numPages = Math.ceil(numRows / numPerPage);
        material.getPagination(limit, sortString = null, function (err, result) {
            if (err) console.log(err);
            vacancy.getAll((err, vacancies) => {
                global.helpers.replaceTime(result);
                var pagination = {
                    current: page,
                    pages: numPages,
                    previous: page - 1,
                    next: page + 1
                };
                if (req.user) {
                    var user = { username: req.user[0].login }
                }
                else user = null
                res.render('requests', {
                    materials: result,
                    pagination,
                    user: user,
                    vacancy: vacancies
                });
            })
        });
    });
});

router.get('/requestsPage/:page', function (req, res) {
    let numRows,
        numPerPage = 10,
        page = parseInt(req.params.page, 10) || 1,
        numPages,
        skip = (page - 1) * numPerPage,
        end_limit = numPerPage,
        limit = skip + ',' + end_limit,
        sortString = getSortString(req);
    material.getCount(function (err, result) {
        numRows = result[0].numRows;
        numPages = Math.ceil(numRows / numPerPage);
        material.getPagination(limit, sortString, function (err, result) {
            global.helpers.replaceTime(result);
            var pagination = {
                current: page,
                pages: numPages,
                previous: page - 1,
                next: page + 1
            };
            res.render('requestsPartial', {
                materials: result,
                pagination,
            });
        });
    });
});

router.post('/follow', isAuthenticated, function (req, res) {
    var material_id = req.body.material_id;
    var date = new Date();
    var date_viwed = global.helpers.timeParse(date);
    material.update(material_id, {
        date_viwed: date,
        status: 2
    });
    res.send({
        date_viwed: date_viwed
    });
});

router.post('/search', isAuthenticated, (req, res) => {

    req.checkBody('search', 'Введён не корректный email').isEmail()
    var search;

    if (!req.validationErrors()) {
        search = {
            searchString: req.body.search,
            type: 'email'
        }
    } else {
        if (req.body.search.split(' ').length < 2) {
            search = {
                searchString: req.body.search,
                type: 'one'
            }
        }
        if (req.body.search.split(' ').length >= 2) {
            var searchArr = req.body.search.split(' ');
            search = {
                searchString1: searchArr[0],
                searchString2: searchArr[1],
                type: 'two'
            }
        }
    }
    material.search(search, (err, result) => {
        global.helpers.replaceTime(result);
        res.render('search', {
            materials: result,
            session: { username: req.session.username, authorized: req.session.authorized }
        });
    });
});
router.post('/ajax', (req, res) => {
    material.search(req.body.search, (err, result) => {
        global.helpers.replaceTime(result);
        res.render('search', {
            materials: result,
            session: { username: req.session.username, authorized: req.session.authorized }
        });
    });
});


function getSortString(req) {
    var sortString = "order by ";
    let date_upload = req.query.dateupload != 0 || undefined ? ", material.date_upload " + SORT[req.query.dateupload] : "",
        date_viwed = req.query.dateviwed != 0 || undefined ? ", material.date_viwed " + SORT[req.query.dateviwed] : "",
        status = " material.status " + SORT[req.query.status];
    return sortString += status + date_upload + date_viwed;
}

module.exports = router