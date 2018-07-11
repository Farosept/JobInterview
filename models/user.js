var db = require('../db');

exports.getUser = function(login, callback){   
    return db.query('select * from user where login = ?',[login], callback)
}
exports.getUserById = function(user_id, callback){
  return db.query('select * from user where user_id = ?',[user_id], callback);
}
  // exports.addUser = function(user){
  //   user.password = bcrypt.hashSync(user.password,10);
  //   connection.query('insert into user set ?',user, function(err, rows, fields) {
  //     if (err) throw err;
  //   });
  // }
  // exports.editUser = function(user){
  //   connection.query('update user set ?',user, function(err, rows, fields) {
  //     if (err) throw err;
  //   });
  // }
  // exports.delUser = function(email){
  //   connection.query('delete from user where `email` = ?', [email], function(err, rows, fields) {
  //     if (err) throw err;
  //   });
  // }