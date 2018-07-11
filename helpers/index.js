/**
 * Принимает дату типа Date. Возвращает строку в формате "dd.mm.yy hh:mm:ss"
 *
 * @param {Date} date Дата типа Date.
 * @return {string} Строка в формате "dd.mm.yy hh:mm:ss".
 */
exports.timeParse = function (date) {
    if (Object.prototype.toString.call(date) !== "[object Date]") throw ("argument type should Date");
    var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate(),
        mouth = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1,
        year = date.getFullYear(),
        seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds(),
        hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours(),
        minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes(),
        time = hours + ':' + minutes + ':' + seconds;
    return day + '.' + mouth + '.' + year + ' ' + time;
}
/**
 * Принимает массив данных и меняет формат даты у date_viwed и date_upload.
 *
 * @param {array} result Массив данных из бд.
 */
exports.replaceTime = function (result) {
    try {
    result.forEach(element => {
        if (element.date_viwed !== null) {
            var date = new Date(element.date_viwed.toISOString());
            element.date_viwed = global.helpers.timeParse(date);
        }
        if (element.date_upload !== null) {
            var date = new Date(element.date_upload.toISOString());
            element.date_upload = global.helpers.timeParse(date);
        }
    });
} catch (error){
    console.error(error)
}
}