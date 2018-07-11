var app = require('../server').app;
var request = require('supertest');
var agent = request.agent(app);

describe("Тестирование admin.js", () => {
    before((done) => {
        agent
            .post('/auth/login')
            .send({ email: 'lobar.you@gmail.com', password: '123' })
            .end((err, res) => {
                done();
            });
    });
    describe("Тестирование /add", ()=>{
        it('Должен возвращать ошибку (пустое поле с название вакансии)', (done) => { // title empty
            agent
                .post('/admin/add')
                .set("Content-Type", "application/json")
                .send({
                    title: "",
                    description: "test description",
                    total: 3,
                    quantity: 3,
                })
                .expect([{
                    location: 'body',
                    param: 'title',
                    msg: 'Поле название не может быть пустым',
                    value: ""
                }
                ],
                    done)
        });
        it('Должен возвращать ошибку (пустое поле с описанием вакансии)', (done) => { // description empty
            agent
                .post('/admin/add')
                .set("Content-Type", "application/json")
                .send({
                    title: "test title",
                    description: "",
                    total: 3,
                    quantity: 3,
                })
                .expect([{
                    location: 'body',
                    param: 'description',
                    msg: 'Поле описание не может быть пустым',
                    value: ""
                }
                ],
                    done)
        });
        it('Должен возвращать ошибку (количество показываемых вопросов больше чем общее количество вопросов)', (done) => { // quantity>total
            agent
                .post('/admin/add')
                .set("Content-Type", "application/json")
                .send({
                    title: "test title",
                    description: "test description",
                    total: 3,
                    quantity: 4,
                })
                .expect([{
                    msg: 'Количество отображаемых впросов должно быть не больше количества вопросов'
                }
                ],
                    done)
        });
        it('Должна добавиться вакансия и вопросы (идеальные условия)', (done) => { // with question
            agent
                .post('/admin/add')
                .set("Content-Type", "application/json")
                .send({
                    title: "test title",
                    description: "test description",
                    total: 1,
                    quantity: 1,
                    question1:"test question",
                    time1:"00:00:01"
                })
                .expect("ok",
                    done)
        });
        it('Должна добавиться вакансия без вопросов (Поля с вопросами не заполняются)', (done) => {
            agent
                .post('/admin/add')
                .set("Content-Type", "application/json")
                .send({
                    title: "test title",
                    description: "test description",
                })
                .expect("ok",
                    done)
        });
    });
    describe("Тестированеи /update",()=>{
        it("Должен вернуть ошибку 'Поле название не может быть пустым'", (done)=>{
            agent
            .post('/admin/update')
            .set("Content-Type", "application/json")
            .send({
                title: "",
                description: "test description",
            })
            .expect([{
                location: 'body',
                param: 'title',
                msg: 'Поле название не может быть пустым',
                value: ""
            }
            ],
                done)
        });
        it("Должен вернуть ошибку 'Поле описание не может быть пустым'", (done)=>{
            agent
            .post('/admin/update')
            .set("Content-Type", "application/json")
            .send({
                title: "test title",
                description: "",
            })
            .expect([{
                location: 'body',
                param: 'description',
                msg: 'Поле описание не может быть пустым',
                value: ""
            }
            ],
                done)
        });
        it('Должен возвращать ошибку (количество показываемых вопросов больше чем общее количество вопросов)', (done) => { // quantity>total
            agent
                .post('/admin/update')
                .set("Content-Type", "application/json")
                .send({
                    title: "test title",
                    description: "test description",
                    total: 3,
                    quantity: 4,
                })
                .expect([{
                    error:true,
                    msg: 'Количество отображаемых впросов должно быть не больше количества вопросов'
                }
                ],
                    done)
        });

        });
});