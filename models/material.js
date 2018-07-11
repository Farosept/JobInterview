var db = require('../db');

exports.add = function(material, callback){
  return db.query('insert into material set ?', material, callback);
}
exports.getAll = function(callback){
  return db.query('select * from material inner join vacancy on material.vacancy_id = vacancy.vacancy_id', callback);
}
exports.getById= function(material_id,callback){
  return db.query('select * from material where material_id = ?',material_id, callback);
}
exports.getCount = function(callback){
  return db.query('select count(*) as numRows from material', callback);
}
exports.getPagination = function(limit, sort, callback){
  let queryString = "";
  if(sort){
    queryString = 'select * from material inner join vacancy on material.vacancy_id = vacancy.vacancy_id '+sort+' LIMIT '+limit+';';
  }else{
    queryString = 'SELECT * FROM(SELECT * FROM (SELECT * FROM  `material` where status = "1" ORDER by material.date_upload asc) t1'+
    ' UNION '+
    'SELECT * FROM (SELECT * FROM `material`WHERE status = "2" ORDER by date_viwed desc) t2) as m inner join vacancy as v on m.vacancy_id = v.vacancy_id LIMIT '+limit+";";
  }
  return db.query(queryString, callback);
}
exports.search = function(search, callback){
  var queryString = 'select * from material as m inner join vacancy as v on m.vacancy_id = v.vacancy_id WHERE';
  if(search.type == 'one'){
    queryString += '(`m`.`first_name` LIKE "%'+search.searchString+'%") or (`m`.`last_name` LIKE "%'+search.searchString+'%");';
    return db.query(queryString, callback);
  }
  if(search.type == 'two'){
    queryString += '(`m`.`first_name` LIKE "%'+search.searchString1+'%" and `m`.`last_name` LIKE "%'+search.searchString2+'%") OR '+
                   '(`m`.`first_name` LIKE "%'+search.searchString2+'%" and `m`.`last_name` LIKE "'+search.searchString1+'%");';
    return db.query(queryString, callback);
  }
  if(search.type == 'email'){
    queryString += '`m`.`email` LIKE "%'+search.searchString+'%";';
    return db.query(queryString, callback);
  }
  return;
}
exports.update = function(material_id, material, callback){
  return db.query('update material set ? where material_id = ?', [material,material_id], function(err, rows, fields) {
    if (err) throw err;
  });
}
//Поиск такого же кандидата в базе
exports.find = function(сandidate, callback){
  return db.query('select * from material where vacancy_id = '+сandidate.vacancy_id+' AND first_name = "'+сandidate.first_name+'" AND last_name = "'+сandidate.last_name+'" AND email = "'+сandidate.email+'";', callback);
}