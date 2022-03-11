"use strict"
//const socketone = io.connect(); // querySelector : css 선택자를 그대로 사용 가능
// const nickName = document.querySelector("#nickName") // querySelector : css 선택자를 그대로 사용 가능
const chatList = document.querySelector(".chatting-list")
const chatInput = document.querySelector(".chatting-input")
const sendButton = document.querySelector(".send-button")
const displayContainer = document.querySelector(".display-container")
const modal = document.getElementById("modal_id");

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

function openModal2() {
    modal.style.display = "flex";
}

function closeModal() {
    modal.style.display = "none";
}

function selectBoxChange(value) {
    console.log("MBTI:" + value);
    $('#mbti_id').val(value).prop("selected", true);
}

function selectBoxChangeTwo(value) {
    console.log("MBTI:" + value);
    $('#mbti_idTwo').val(value).prop("selected", true);
}

var nickName;

window.onload = function() {
    nickName = "";
    var roomName = "";
    var handle = null;
    var mbti = "";
    var topic = "";
    var othermbti = "";
    var socket = io.connect();


    //확인 버튼 눌렀을때 닉네임과 mbti value값 지정
    $("#nicknameBtn").on("click", function() {
        var nickNameValue = $("input[name='nickname']").val();
        nickName = nickNameValue;
        var mbtiValue = $("#mbti_id option:selected").val();
        mbti = mbtiValue;
        socket.emit("nickNameCheck", { name: nickNameValue, mbti: mbtiValue });
    });

    socket.on("nullError", function(result) {
        alert(result);
    });

    socket.on("sameNameError", function(result) {
        alert(result);
    });

    //닉네임 확인이 완료되었을 때, 닉네임 입력 창이 사라지고 주제 선택창이 뜨도록 id를 바꿔줌.
    socket.on("nickNameCheckComplete", function() {
        document.getElementById("modal_id").style.display = "none";
        $(".modal_class").removeAttr("id");
        $(".modal_classTwo").attr("id", "modal_id");
        document.getElementById("modal_id").style.display = "flex";
    });

    //확인 버튼 눌렀을 때 주제의 value값과 상대의 mbti 지정.
    $("#chatStartBtn").on("click", function() {
        var topicValue = $("input[name='topic']:checked").val();
        topic = topicValue;
        var othermbtiValue = $("#mbti_idTwo option:selected").val();
        othermbti = othermbtiValue;
        socket.emit("topicCheck", { topic: topicValue, othermbti: othermbtiValue });
    });

    //주제선택이 완료되면 확인버튼의 id변경.
    socket.on("topicCheckComplete", function() {
        document.getElementById("modal_id").style.display = "none";
        socket.emit("matchClick", { name: nickName });
    })

    socket.on("matchClickComplete", function() {
        console.log("매칭중입니다");
        startMatching();
    })

    socket.on("matchingComplete", function(data) {
        stopMatching();
        window.location.replace("http://localhost:5000/");
        console.log("매칭이 완료되었습니다.")
        roomName = data;
    })

    function startMatching() {
        if (handle == null) {
            handle = setInterval(function() {
                socket.emit("randomMatching", { name: nickName, mbti: mbti, topic: topic, othermbti: othermbti });
            }, 500)
        }
    }

    function stopMatching() {
        clearInterval(handle);
        handle = null;
    }

}

////////////////////////////////////////////////////

function send() {
    const param = {
        name: nickName.value,
        msg: chatInput.value
    }
    socketone.emit("chatting", param)
        // ID : chatting, Message : from front 전송
}

chatInput.addEventListener("keypress", (event) => {
    if (event.keyCode === 13) {
        send()
    }
})

sendButton.addEventListener("click", send)

socket.on("chatting", (data) => {
    const { name, msg, time } = data;
    const item = new LiModel(name, msg, time);
    item.makeLi()
    displayContainer.scrollTo(0, displayContainer.scrollHeight)
})

function LiModel(name, msg, time) {
    this.name = name;
    this.msg = msg;
    this.time = time;

    this.makeLi = () => {
        const li = document.createElement("li");
        li.classList.add(nickName.value === this.name ? "sent" : "received")
        const dom = `<span class="profile">
            <span class="user">${this.name}</span>
            </span>
            <span class="message">${this.msg}</span>
            <span class="time">${this.time}</span>`;
        li.innerHTML = dom;
        chatList.appendChild(li);
    }
}