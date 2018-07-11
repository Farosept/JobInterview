var db = require('../db');

exports.add = function(obj, callback){
  return db.query('insert into material_question_time set ?', obj,(err,res)=>{
      
    if(err) throw err;
  });
}
exports.getByObj = function(obj, callback){

  return db.query('select * from material_question_time as m inner join question as q on m.question_id = q.question_id where material_id = ? AND attempt_number = ? order by number asc',[obj.material_id, obj.attempt_number], callback);
}
exports.getByMaterialId = function(material_id, callback){

  return db.query('select sum(spent_time) as time from material_question_time where material_id = ?  group by attempt_number',[material_id], callback);
}
exports.getCountAttempts = function(material_id, callback) {
  return db.query('select COUNT(DISTINCT attempt_number) as count from material_question_time where material_id = ?', [material_id], callback);
}
