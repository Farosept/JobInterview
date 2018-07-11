var util = require('util');

var express = require('express');

var router = express.Router();

var material = require('../models/material');

router.post('/', function(req, res){
    var vacancy_id = req.body.vacancy_id,
        first_name = req.body.first_name,
        last_name = req.body.last_name,
        email = req.body.email,
        phone = req.body.phone,
        date_upload = new Date();
    req.checkBody('first_name', 'Поле "Имя" не может быть пустым').notEmpty();
    req.checkBody('last_name', 'Поле "Фамилия" не может быть пустым').notEmpty();
    req.checkBody('email', 'Поле "Email" не может быть пустым').notEmpty();
    req.checkBody('email', 'Введён не корректный email').isEmail();
    if(phone!='')
    req.checkBody('phone', 'Номер телефона не должен содержать букв').isMobilePhone("ru-RU");
    var errors = req.validationErrors();
    if(errors){
        res.send({
            errors
        });
        return;
    }
    
    var files = req.files;
    if(Object.keys(files).length === 0){
        res.send({
            errors: [{msg: "Нужно обязательно прикрепить файл"}]
        });
        return;
    }
    var file = util.inspect(files);
    file_path = file.split('path: \'')[1].split('\',')[0].toString().replace(/\\/g, '/');
    var Material = {
        file_path: "/"+file_path,
        file_type: 2,
        vacancy_id: vacancy_id,
        date_viwed: null,
        status: 1,
        first_name: first_name,
        last_name: last_name,
        email: email,
        phone: phone,
        date_upload: date_upload
    };

    material.find(Material,(err, result)=>{
        if(err){
            console.log(err);
             return;
        }
        if(result.length==0){
            material.add(Material);
            res.send({
                success:true
            });
        }else{
            res.send({
                errors: [{msg: "Вы уже отправили резюме на эту вакансию"}]
            });
            return;
        }
    });


});

module.exports = router