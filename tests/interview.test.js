var app = require('../server').app;
var request = require('supertest');
describe("Тестированеи interview.js",()=>{
    it('Должен возвращять ошибку (пустое поле имя)',(done)=>{ // first_name empty
        request(app)
        .post('/interview/check')
        .set("Content-Type", "application/json")
        .send({
            vacancy_id : 200,
            first_name : "",
            last_name : Math.random().toString(36).replace(/[^a-z]+/g, ''),
            email : "horev@mail.ru",
            phone : ""
        })  
        .expect({ errors:
                    [ { location: 'body',
                        param: 'first_name',
                        msg: 'Поле "Имя" не может быть пустым',
                        value:"" }
                    ]},
                    done)
    });
    it('Должен возвращать ошибку (пустое поле фамилия)',(done)=>{ // last_name empty
        request(app)
        .post('/interview/check')
        .set("Content-Type", "application/json")
        .send({
            vacancy_id : 200,
            first_name : Math.random().toString(36).replace(/[^a-z]+/g, ''),
            last_name : "",
            email : "horev@mail.ru",
            phone : ""
        })  
        .expect({ errors:
                    [ { location: 'body',
                        param: 'last_name',
                        msg: 'Поле "Фамилия" не может быть пустым',
                        value:"" }
                    ]},
                done)
    });
    it('Должен возвращать ошибку (пустое поле email)',(done)=>{ // email empty
        request(app)
        .post('/interview/check')
        .set("Content-Type", "application/json")
        .send({
            vacancy_id : 200,
            first_name : Math.random().toString(36).replace(/[^a-z]+/g, ''),
            last_name : Math.random().toString(36).replace(/[^a-z]+/g, ''),
            email : "",
            phone : ""
        })  
        .expect({ errors:
                    [ { location: 'body',
                        param: 'email',
                        msg: "Введён не корректный email",
                        value:"" },
                        {
                        "location": "body",
                        "msg": 'Поле "Email" не может быть пустым',
                        "param": "email",
                        "value": ""}
                    ]},
                done)
    });
    it('Должен возвращать ошибку "Введён не корректный email"',(done)=>{ // email correct
        request(app)
        .post('/interview/check')
        .set("Content-Type", "application/json")
        .send({
            vacancy_id : 200,
            first_name : Math.random().toString(36).replace(/[^a-z]+/g, ''),
            last_name : Math.random().toString(36).replace(/[^a-z]+/g, ''),
            email : "mail",
            phone : ""
        })  
        .expect({ errors:
                    [{
                        "location": "body",
                        "msg": "Введён не корректный email",
                        "param": "email",
                        "value": "mail"}
                    ]},
                done)
    });
    it('Должен вернуть ошибку (ввод в поле номера телефона букв)',(done)=>{ // 
        request(app)
        .post('/interview/check')
        .set("Content-Type", "application/json")
        .field({
            vacancy_id : 200,
            first_name : Math.random().toString(36).replace(/[^a-z]+/g, ''),
            last_name : Math.random().toString(36).replace(/[^a-z]+/g, ''),
            email : "mail@mail.ru",
            phone : "цуклзщкоузоп"
        })          .attach("file","./tests/test.docx")
        .expect({ errors:
            [ { location: 'body',
                param: 'phone',
                msg: 'Номер телефона не должен содержать букв',
                value:"цуклзщкоузоп" }
            ]},
        done)
    });
});