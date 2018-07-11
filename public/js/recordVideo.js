var recordStream = null;
var videoElement = document.querySelector('video');
var recorder;
var questions = null;
var rands = [];
var timerID;
var recordedChunks = [];
var spentQuestions = [];
var isNext = false;
(function checkCam() {
    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
            var videoElement = document.querySelector('video');
            recordStream = stream;
            videoElement.srcObject = stream;
            videoElement.onloadedmetadata = (e) => {
                videoElement.play();
                videoElement.muted = true;
                videoElement.controls = false;
                videoElement.currentTime=0;
            }
        }).catch((err) => {
            console.log(err);
            var confirmResult = confirm("Подключите камеру или разрешите и нажмите ок");
            if (confirmResult) checkCam();
            else window.location.href = "/";
        });
    } else {
        navigator.getUserMedia({ video: true, audio: true }, (stream) => {
            recordStream = stream;
            videoElement.src = window.URL.createObjectURL(stream);
            videoElement.play();
            videoElement.muted = true;
            videoElement.controls = false;
        }, (err) => {
            console.log(err);
            var confirmResult = confirm("Подключите камеру или разрешите и нажмите ок");
            if (confirmResult) checkCam();
            else window.location.href = "/";
        });
    }
})();
function getData() {
    $(document).ready(function () {
        $.get('/interview/questions/' + material.vacancy_id, function (data) {
            questions = data;
            var rnd = getRand(parseInt(vacancy[0].quantity_questions));
            $('#question').html(questions.questions[rnd].question_text);
            $('#my_timer').html(questions.questions[rnd].question_time);
            spentQuestions.push({question_id:questions.questions[rnd].question_id, time:questions.questions[rnd].question_time, end:null});
            startTimer();
        });
    });
}
function next() {
    isNext = true;
    
}
function tryAgain(){
    window.location.reload(false);
}
function postFile() {
    var blob = new Blob(recordedChunks,{
        type: recordedChunks[0].type
    });
    getBlobDuration(blob).then(function(duration) {
        console.log(duration + ' seconds');
      });
    console.log({ blob, material })
    var url = '/interview/finish';
    var file = new File([blob], "video.webm", {
        type: 'video/webm'
    });

    var request = new XMLHttpRequest();
    request.upload.onload = function () {
        document.getElementsByClassName('container')[1].innerHTML =  '<div class="row" style="margin:auto; text-align:center;"><h2>Спасибо, что ответили на наши вопросы. Мы ответим вам в ближайшее время.</h2> <span style="font-size:20pt; color:red;">Попыток осталось: '+(3-attempt_number)+'</span>&nbsp<br><button class="btn btn-success btn-lg" type="button" onclick="tryAgain()">Попробовать ещё</button></div>';
    }
    request.open('POST', url);
    var formData = new FormData();
    formData.append('file', file);
    formData.append('first_name', material.first_name);
    formData.append('last_name', material.last_name);
    formData.append('email', material.email);
    formData.append('vacancy_id', material.vacancy_id);
    formData.append('phone', material.phone);
    formData.append('material_id', material_id);
    formData.append('attempt_number', attempt_number);
    request.send(formData);
    return;
}

function getBrowser(){
    var ua = navigator.userAgent;
    
    if (ua.search(/MSIE/) > 0) return 'Internet Explorer';
    if (ua.search(/Firefox/) > 0) return 'Firefox';
    if (ua.search(/Opera/) > 0) return 'Opera';
    if (ua.search(/Chrome/) > 0) return 'Google Chrome';
}

function start() {
    if(!confirm('Вы действительно готовы начать тестирование?')) return;
    $("#start-button").toggle();
    $("#next-button").toggle();
    $("#block-question").toggle();
    $("#pre").toggle();

    var options = {
        mimeType:"video/webm\;codecs=vp9"
    }

    var browser = getBrowser();
    if(browser == "Firefox"){ //есть проблемма с firefox с доп. параметрами бросает ошибку
        recorder = new MediaRecorder(recordStream);
    }else{
        recorder = new MediaRecorder(recordStream, options);
    }

    recorder.ondataavailable = (event)=>{
        recordedChunks.push(event.data);
    }
    recorder.onstop = (e)=>{
        recordStream.getTracks().forEach(e=>{e.stop()})
        postFile();
    }
    recorder.onstart = (e)=>{
        getData();
    }
    recorder.start(1000);
    
}
function handleDataAvailable(event) {
    if (event.data.size > 0) {
        recordedChunks.push(event.data);
    } else {
    }
    
}
function finishInterview() {
    recorder.stop();
}

$('#check-mic').on('click', function () {
    if (videoElement.muted == true) {
        videoElement.muted = false;
    } else {
        videoElement.muted = true;
    }
})
function findInArr(arr, number) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == number) { return true; }
    }
    return false;
}
function getRand(quantity) {
    var rand = Math.floor(Math.random() * (quantity)) + 0;
    if (findInArr(rands, rand) == false) {
        rands.push(rand);
        return rand;
    } else {
        return getRand(quantity);
    }
}
function mathTime(times){
    var seconds = 0;
    times.forEach(e=>{
      var arrTime1 = e.split(":"),
          m1 = parseInt(arrTime1[1]) * 60,
          s1 = parseInt(arrTime1[2]);
          if(seconds == 0){
            seconds = s1 + m1;
          }else{
            seconds += s1 + m1;
          }
    });  
    if(seconds>=60){
        var minute = Math.floor(seconds / 60);
        var second = seconds - minute *60;
         
        return "00:"+ minute < 10 ? "0"+minute.toString() : minute +":"+ second < 10 ? "0"+second.toString() : second;
    }
      return "00:00:"+seconds;
  }