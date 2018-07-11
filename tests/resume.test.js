var app = require('../server').app;
var request = require('supertest');
describe("Тестированеи resume.js",()=>{
    it('Должен возвращять ошибку (пустое поле имя)',(done)=>{ // first_name empty
        request(app)
        .post('/resume')
        .set("Content-Type", "application/json")
        .send({
            vacancy_id : 73,
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
    it('Должен добавиться (Ввод чисел в поле имя)',(done)=>{
        request(app)
        .post('/resume')
        .set("Content-Type", "application/json")
        .field({
            vacancy_id : 73,
            first_name : Math.random().toString(36),
            last_name : Math.random().toString(36).replace(/[^a-z]+/g, ''),
            email : "horev@mail.ru",
            phone : ""
        })          .attach("file","./tests/test.docx")
        .expect({success: true},
                done)
    });
    it('Должен вернуть ошибку (Загрузка файла не docx и rtf формата)',(done)=>{
        request(app)
        .post('/resume')
        .set("Content-Type", "application/json")
        .field({
            vacancy_id : 73,
            first_name : Math.random().toString(36).replace(/[^a-z]+/g, ''),
            last_name : Math.random().toString(36).replace(/[^a-z]+/g, ''),
            email : "horev@mail.ru",
            phone : ""
        })          .attach("file","./tests/test.exe")
        .expect({ errors:
            [ {msg: 'Файл должен быть в формате docx или rtf',}
            ]},
        done)
    });
    it('Должен возвращать ошибку (пустое поле фамилия)',(done)=>{ // last_name empty
        request(app)
        .post('/resume')
        .set("Content-Type", "application/json")
        .send({
            vacancy_id : 73,
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
        .post('/resume')
        .set("Content-Type", "application/json")
        .send({
            vacancy_id : 73,
            first_name : Math.random().toString(36).replace(/[^a-z]+/g, ''),
            last_name : Math.random().toString(36).replace(/[^a-z]+/g, ''),
            email : "",
            phone : ""
        })  
        .expect({ errors:
                    [ { location: 'body',
                        param: 'email',
                        msg: 'Поле "Email" не может быть пустым',
                        value:"" },
                        {
                        "location": "body",
                        "msg": "Введён не корректный email",
                        "param": "email",
                        "value": ""}
                    ]},
                done)
    });
    it('Должен возвращать ошибку "Введён не корректный email"',(done)=>{ // email correct
        request(app)
        .post('/resume')
        .set("Content-Type", "application/json")
        .send({
            vacancy_id : 73,
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
    it('Должен возвращать ошибку (отправка без файла)',(done)=>{ // file
        request(app)
        .post('/resume')
        .set("Content-Type", "application/json")
        .field({
            vacancy_id : 73,
            first_name : Math.random().toString(36).replace(/[^a-z]+/g, ''),
            last_name : Math.random().toString(36).replace(/[^a-z]+/g, ''),
            email : "mail@mail.ru",
            phone : ""
        })          .attach("file","")
        .expect({errors: [{msg: "Нужно обязательно прикрепить файл"}]},
                done)
    });
    it('Должен возвращать ошибку (при повторной отправке)',(done)=>{ // 
        request(app)
        .post('/resume')
        .set("Content-Type", "application/json")
        .field({
            vacancy_id : 200,
            first_name : "Артём",
            last_name : "Хорев",
            email : "mail@mail.ru",
            phone : ""
        })          .attach("file","./tests/test.docx")
        .expect({errors: [{msg: "Вы уже отправили резюме на эту вакансию"}]},
                done)
    });
    it('Должен завершится без ошибок (идеальные условия)',(done)=>{ // 
        request(app)
        .post('/resume')
        .set("Content-Type", "application/json")
        .field({
            vacancy_id : 73,
            first_name : Math.random().toString(36).replace(/[^a-z]+/g, ''),
            last_name : Math.random().toString(36).replace(/[^a-z]+/g, ''),
            email : "mail@mail.ru",
            phone : ""
        })          .attach("file","./tests/test.docx")
        .expect({success: true},
                done)
    });
    it('Должен вернуть ошибку (ввод в поле номера телефона букв)',(done)=>{ // 
        request(app)
        .post('/resume')
        .set("Content-Type", "application/json")
        .field({
            vacancy_id : 73,
            first_name : Math.random().toString(36).replace(/[^a-z]+/g, ''),
            last_name : Math.random().toString(36).replace(/[^a-z]+/g, ''),
            email : "mail@mail.ru",
            phone : "цуклзщкоузоп"
        })          .attach("file","./tests/test.docx")
        .expect({ errors:
            [ { location: 'body',
                param: 'phone',
                msg: "Номер телефона не должен содержать букв",
                value:"цуклзщкоузоп"}
            ]},
        done)
    });
});