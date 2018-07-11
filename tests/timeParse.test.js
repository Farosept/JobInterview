var helpers = require('../helpers/index'); 
var chai = require('chai');
describe("Тестирование функций из модуля helpers",()=>{
    it("Функция должна возвращать дату и время в формате 'dd.mm.yy hh:mm:ss'",()=>{
        let time = helpers.timeParse(new Date(2018,0,1,12,0,0,0));
        chai.assert.equal(time,"01.01.2018 12:00:00");
    });
    it("Функция должна возвращать ошибку (передача в функцию аргумента типа string)",()=>{
        chai.assert.throws(()=>{return helpers.timeParse('asd')},"argument type should Date");
    });
    it("Функция должна возвращать ошибку (передача в функцию аргумента типа int)",()=>{
        chai.assert.throws(()=>{return helpers.timeParse(123)},"argument type should Date");
    });
    it("Функция должна возвращать ошибку (передача в функцию аргумента типа object)",()=>{
        chai.assert.throws(()=>{return helpers.timeParse({'asd':123})},"argument type should Date");
    });
});