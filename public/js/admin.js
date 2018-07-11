var total = 0;
var totalAdd = 0;
var questions = null;
var delquestions = [];
var addquestions = [];
var vacancy;
function delQuestion(cont, idqst, idvcs) {
    if (!delquestions[idvcs]) {
        delquestions[idvcs] = [];
    }
    delquestions[idvcs].push(idqst)
    $(cont).parent().parent().parent().remove();
    $(cont).remove();
}
function delNewQuestion(cont) {
    $(cont).parent().parent().parent().remove();
    $(cont).remove();
}
function addNewQuestion(idqst, idvcs) {
    if (!addquestions[idvcs]) {
        addquestions[idvcs] = [];
    }
    addquestions[idvcs].push(idqst)
}
function post(id) {
    var request = new XMLHttpRequest();
    request.open('POST', "/admin/update");
    var formData = new FormData(document.getElementById("formedit" + id));
    if (delquestions[id]) formData.append('delquestions[]', delquestions[id]);
    if (addquestions[id]) formData.append('addquestions[]', addquestions[id]);
    request.send(formData);
}
function postAdd(context){
    var request = new XMLHttpRequest();
    request.open('POST', "/admin/add");
    var form = $(context).parent().parent();
    var formData = new FormData(form[0]);
    request.onreadystatechange = function () {
        
        if(request.readyState === XMLHttpRequest.DONE && request.status === 422){
            var errors = JSON.parse(request.response);
            $(form[0]).find('.err').html('');
            errors.forEach(err=>{
                $(form[0]).find('.err').append('<div class="alert alert-danger"><strong>Ошибка!</strong> '+err.msg+'</div>');
            });
        }
        if(request.readyState === XMLHttpRequest.DONE && request.status === 200){
            window.location.href="/";
        }
    }
    request.send(formData);

}
function addInputEdit(vid, context){
    var thistotal = $('#total'+vid).attr('value');
    thistotal++;
    $(document).ready(function () {
        $('<div class="form-group" style="border: 1px solid #c0c0c0; padding: 3px;"></div>')
        .append('<label>Вопрос</label>')
        .append($('<div class="input-group"></div>')
              .append('<input name="question'+thistotal+'" class="form-control" type="text"  />')
              .append('<span class="input-group-btn"><button class="btn btn-default" type="button" onClick="delNewQuestion(this)">Удалить</button></span>'))
        .append($('<div class="form-group"></div>')
              .append('<label>Время</label><input class="form-control" name="time'+thistotal+'"id="inputTime'+thistotal+'"  type="time" step="1" >')        )        
      .appendTo($('#modalVacancyEdit'+vid).find('.questions'));
    });
    $('#total'+vid).attr('value', thistotal);
    addNewQuestion(thistotal,vid);
}
function addInput(context){
    totalAdd++;
    $(document).ready(function () {
        $('<div class="form-group" style="border: 1px solid #c0c0c0; padding: 3px;"></div>')
        .append('<label>Вопрос</label>')
        .append($('<div class="input-group"></div>')
              .append('<input name="question'+totalAdd+'" class="form-control" type="text"  />')
              .append('<span class="input-group-btn"><button class="btn btn-default" type="button" onClick="delNewQuestion(this)">Удалить</button></span>'))
        .append($('<div class="form-group"></div>')
              .append('<label>Время</label><input class="form-control" name="time'+totalAdd+'"id="inputTime'+totalAdd+'"  type="time" step="1" >')        )        
      .appendTo($('#modalVacancy').find('.questions'));
    });
    $('#total').attr('value', totalAdd);
}
$(document).ready(function () {
    if(vacancy){
    vacancy.forEach(v => {
        $.get('/admin/questions/' + v.vacancy_id, function (data) {
            questions = data;
            console.log(data)
            $('#modalVacancyEdit' + v.vacancy_id).find('.questions').html('');
            questions.forEach(q => {
                total++;
                $('<div class="form-group" style="border: 1px solid #c0c0c0; padding: 3px;"></div>')
                    .append('<label>Вопрос</label>')
                    .append($('<div class="input-group"></div>')
                        .append('<input name="question' + total + '" class="form-control" type="text" value="' + q.question_text + '" />')
                        .append('<span class="input-group-btn"><button class="btn btn-default" type="button" onClick="delQuestion(this,' + q.question_id + ',' + v.vacancy_id + ')">Удалить</button></span>'))
                    .append($('<div class="form-group"></div>')
                        .append('<label>Время</label><input class="form-control" name="time' + total + '"id="inputTime' + total + '"  type="time" step="1" value="' + q.question_time + '">')
                        .append('<input name="qid' + total + '" type="hidden" value="' + q.question_id + '"/>'))
                    .appendTo($('#modalVacancyEdit' + v.vacancy_id).find('.questions'));
            });
            $('#total' + v.vacancy_id).attr('value', total.toString());
            total = 0;
        });
    });
}
});
