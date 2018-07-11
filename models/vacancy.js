var db = require('../db');

exports.getAll = function(callback){
  return db.query('select * from vacancy', callback);
}

exports.getById = function(vacancy_id,callback){
 return db.query('select * from vacancy where vacancy_id= ?', [vacancy_id], callback);
}

exports.add = function(vacancy, callback){
  db.query('insert into vacancy set ?', vacancy, callback);
}
exports.update = function(vacancy, vacancy_id, callback){
  db.query('update vacancy set ? where vacancy_id = ?', [vacancy, vacancy_id], callback);
}
exports.delete = function(id){
  db.query('delete from vacancy where `vacancy_id` = ?',[id], function(err, rows, fields) {
    if (err) console.log(err);
  });
}