function startTimer() {
    if(isNext) {
        clearTimeout(timerID);
        isNext = false;
        recorder.requestData();
        var timeTmp = spentQuestions[rands.length-1].time;
        var tArr = $('#my_timer').html().split(':');
        var sArr = timeTmp.split(':');
        var end = new moment($('#my_timer').html(), "HH:mm:ss");
        var start = new moment(timeTmp, "HH:mm:ss");
        spentQuestions[rands.length-1].time = new moment(start.diff(end)).utc().format("HH:mm:ss");
        var startOnVideo = 0,
            endOnVideo = 0;
        if(rands.length>1){
            startOnVideo = spentQuestions[rands.length-2].end;
            endOnVideo = mathTime([startOnVideo, spentQuestions[rands.length-1].time]);
            spentQuestions[rands.length-1].end = endOnVideo;
        }else{
            startOnVideo = "00:00:00";
            endOnVideo = spentQuestions[rands.length-1].time;
            spentQuestions[rands.length-1].end = endOnVideo;
        }
        $.post('/interview/spent/', {
                                    time: spentQuestions[rands.length-1].time, 
                                    material_id: material_id, 
                                    question_id: spentQuestions[rands.length-1].question_id, 
                                    number: rands.length-1,
                                    start_time: startOnVideo,
                                    end_time: endOnVideo,
                                    vacancy_id: vacancy.vacancy_id,
                                    attempt_number: attempt_number
                                }, function (data) {
        });
        if(rands.length==vacancy[0].quantity_questions) {finishInterview(); return;}
        var rnd = getRand(parseInt(vacancy[0].quantity_questions));
        $('#question').html(questions.questions[rnd].question_text);
        $('#my_timer').html(questions.questions[rnd].question_time);
        spentQuestions.push({question_id:questions.questions[rnd].question_id, time:questions.questions[rnd].question_time});
        startTimer();
        return;
    }
    var my_timer = document.getElementById("my_timer");
    var time = my_timer.innerHTML;
    var arr = time.split(":");
    var h = parseInt(arr[0]);
    var m = parseInt(arr[1]);
    var s = parseInt(arr[2]);
    if (s == 0) {
        if (m == 0) {
            if (h == 0) {
                clearTimeout(timerID);
                var startOnVideo = 0,
                endOnVideo = 0;
            if(rands.length>1){
                startOnVideo = spentQuestions[rands.length-2].end;
                console.log(startOnVideo)
                endOnVideo = mathTime([startOnVideo, spentQuestions[rands.length-1].time]);
                spentQuestions[rands.length-1].end = endOnVideo;
            }else{
                startOnVideo = "00:00:00";
                endOnVideo = spentQuestions[rands.length-1].time;
                spentQuestions[rands.length-1].end = endOnVideo;
            }
            $.post('/interview/spent/', {
                                        time: spentQuestions[rands.length-1].time, 
                                        material_id: material_id, 
                                        question_id: spentQuestions[rands.length-1].question_id, 
                                        number: rands.length-1,
                                        start_time: startOnVideo,
                                        end_time: endOnVideo,
                                        vacancy_id: vacancy.vacancy_id,
                                        attempt_number: attempt_number
                                    }, function (data) {
            });
                if(rands.length==vacancy[0].quantity_questions) {
                    finishInterview(); 
                    return;
                }
                

                var rnd = getRand(parseInt(vacancy[0].quantity_questions));
                
                $('#question').html(questions.questions[rnd].question_text);
                $('#my_timer').html(questions.questions[rnd].question_time);
                spentQuestions.push({question_id:questions.questions[rnd].question_id, time:questions.questions[rnd].question_time});
                startTimer();
                return;
            }
            h--;
            m = 60;
        }
        m--;
        s = 59;
    }
    else s--;
    if (s < 10) s = "0" + s.toString();
    if (h < 10) h = "0" + h.toString();
    if (m < 10) m = "0" + m.toString();
    document.getElementById("my_timer").innerHTML = h + ":" + m + ":" + s;
    recorder.requestData();
    clearTimeout(timerID);
    timerID = setTimeout(startTimer, 1000);
}