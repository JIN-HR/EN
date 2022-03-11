function BtnClick(link) {
    location.assign(link);
}

function openModal() {
    document.getElementById("modal_id").style.display = "flex";
}

//선택된 value를 true로 만들어줌
function selectBoxChange(value) {
    console.log("MBTI:" + value);
    $('#mbti_id').val(value).prop("selected",true);
}

function selectBoxChangeTwo(value) {
    console.log("MBTI:" + value);
    $('#mbti_idTwo').val(value).prop("selected", true);
}



window.onload = function(){
    let nickName = "";
    let roomName = "";
    let handle = null;
    let mbti = "";
    let topic = "";
    let othermbti = "";
    let socket = io.connect();

    //id:nicknameBtn을 눌렀을 때
    $("#nicknameBtn").on("click", function(){
        //닉네임과 mbti value값 지정
        let nickNameValue = $("input[name='nickname']").val();
        nickName = nickNameValue;
        let mbtiValue = $("#mbti_id option:selected").val();
        mbti = mbtiValue;

        //파라미터와 함께 서버로 "nickNameCheck"를 내보냄
        socket.emit("nickNameCheck", {name:nickNameValue, mbti:mbtiValue});
    });

    //서버에서 "nullError"이벤트가 발생했을 때
    socket.on("nullError", function(result){
        alert(result);
    });

    //서버에서 "sameNameError"이벤트가 발생했을 때
    socket.on("sameNameError", function(result){
        alert(result);
    });

    //닉네임 확인이 완료되었을 때, 닉네임 입력 창이 사라지고 주제 선택창이 뜨도록 id를 바꿔줌.
    socket.on("nickNameCheckComplete", function(){
        document.getElementById("modal_id").style.display = "none";
        $(".modal_class").removeAttr("id");
        $(".modal_classTwo").attr("id", "modal_id");
        document.getElementById("modal_id").style.display = "flex";
    });
    
    //id:chatStartBtn을 눌렀을 때
    $("#chatStartBtn").on("click", function(){
        //주제의 value값과 상대의 mbti 지정.
        let topicValue = $("input[name='topic']:checked").val();
        topic = topicValue;
        let othermbtiValue = $("#mbti_idTwo option:selected").val();
        othermbti = othermbtiValue;

        //파라미터와 함께 서버로 "topicCheck"를 내보냄
        socket.emit("topicCheck", {topic:topicValue, othermbti:othermbtiValue});
    });

    //주제선택이 완료되면 서버로 "matchClick"을 내보냄
    socket.on("topicCheckComplete", function(){
        document.getElementById("modal_id").style.display = "none";
        socket.emit("matchClick", {name:nickName});
    })
    
    //매칭중일때
    socket.on("matchClickComplete", function(){
        document.querySelector(".loader").style.display = "flex";
        console.log("매칭중입니다");
        startMatching();
    })

    //매칭완료
    socket.on("matchingComplete", function(data){
        stopMatching();
        document.querySelector(".loader").style.display = "none";
        window.location.replace("http://localhost:5000/");
        console.log("매칭이 완료되었습니다.");
        roomName = data;
    })

    //setInterval 함수: 0.5초마다 "randomMatching" 이벤트 발생
    function startMatching(){
        if(handle == null){
            handle = setInterval(function(){
                socket.emit("randomMatching", {name:nickName, mbti:mbti, topic:topic, othermbti:othermbti});
            }, 500)
        }
    }

    //clearInterval 함수: randomMatching 이벤트의 주기적 발생을 멈춤
    function stopMatching(){
        clearInterval(handle);
        handle = null;
    }
}