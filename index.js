function BtnClick(link) {
    location.assign(link);
}

function openNav() {
    document.getElementById("sidepanel_id").style.width = "250px";
}

function closeNav() {
    document.getElementById("sidepanel_id").style.width = "0";
}

function openModal() {
    document.getElementById("modal_id").style.display = "flex";
}
/*
function closeModal(){
    document.getElementById("modal_id").style.display = "none";
}
*/

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


    //확인 버튼 눌렀을때 닉네임과 mbti value값 지정
    $("#chatStartBtn").on("click", function(){
        let mbtiValue = $("#mbti_id option:selected").val();
        mbti = mbtiValue;
        let topicValue = $("input[name='topic']:checked").val();
        topic = topicValue;
        let othermbtiValue = $("#mbti_idTwo option:selected").val();
        othermbti = othermbtiValue;
        socket.emit("infoCheck", {mbti:mbtiValue, topic:topicValue, othermbti:othermbtiValue});
    });

    socket.on("MBTInullError", function(result){
        alert(result);
    })
    socket.on("topicnullError", function(result){
        alert(result);
    })

    socket.on("otherMBTInullError", function(result){
        alert(result);
    })

    //닉네임 확인이 완료되었을 때, 닉네임 입력 창이 사라지고 주제 선택창이 뜨도록 id를 바꿔줌.
    socket.on("infoCheckComplete", function(){
        document.getElementById("modal_id").style.display = "none";
        socket.emit("matchClick");
    });

    
    //여기수정!!!!!!!
    socket.on("matchClickComplete", function(){
        document.querySelector(".loader").style.display = "flex";
        console.log("매칭중입니다");
        startMatching();
    })

    socket.on("matchingComplete", function(data){
        stopMatching();
        document.querySelector(".loader").style.display = "none";
        window.location.replace("http://localhost:5000/");
        console.log("매칭이 완료되었습니다.")
        roomName = data;
        //document.querySelector(".mainbodyPlace").style.display = "none";
        //document.querySelector(".mainPlace").style.display = "none";
        //document.querySelector(".chatPlace").style.display = "flex";
        //document.querySelector(".chatbodyPlace").style.display = "flex";
    })

    function startMatching(){
        if(handle == null){
            handle = setInterval(function(){
                socket.emit("randomMatching", {mbti:mbti, topic:topic, othermbti:othermbti});
            }, 500)
        }
    }

    function stopMatching(){
        clearInterval(handle);
        handle = null;
    }

}
//export {nickName}