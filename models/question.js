var db = require('../db');
exports.get = function(question_id, callback){
  console.log(question_id)
  return db.query('select * from question where question_id = ?',question_id,callback);
}
exports.getRand = function(vacancy_id, callback){
   return db.query('select * from question where vacancy_id = '+vacancy_id+' order by rand() LIMIT 3', callback);
}
exports.getCount = function(vacancy_id, callback){
  return db.query('select count(*) from question where vacancy_id = '+vacancy_id, callback);
}
exports.getAll = function(vacancy_id, callback){
  return db.query('select * from question where vacancy_id = '+vacancy_id+';',callback);
}
exports.add = function (questions) {
  return db.query('insert into question(question_text, question_time, vacancy_id) values ?',[questions]);
}
exports.update = function (question,question_id) {
  return db.query('update question set ? where question_id = ?',[question, question_id], (err,result)=>{
   if(err) console.log(err);
  });
}
exports.delete = function (question_id) {
  return db.query('delete from question where question_id = ?',[question_id])
}
exports.deleteByVacancyId = function (vacancy_id, callback) {
  return db.query('delete from question where vacancy_id = ?',[vacancy_id],callback)
}