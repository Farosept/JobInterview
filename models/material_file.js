var db = require('../db');
exports.add = function(obj) {
    return db.query('insert into material_file set ?', obj,(err, res)=>{
        if(err) console.log(err)
    });
}
exports.getByMaterialId = function(obj, callback) {
    return db.query("select * from material_file where material_id = ? AND attempt_number = ?", [obj.material_id, obj.attempt_number], callback);
}