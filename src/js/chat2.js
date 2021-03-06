/* client */

"use strict"
const socket = io();
const chatList = document.querySelector(".chatting-list")
const chatInput = document.querySelector(".chatting-input")
const sendButton = document.querySelector(".send-button")
const displayContainer = document.querySelector(".display-container")

const clients={
    client:""
};

function send() {
    clients.client = socket;

    //socket 서버에 id파라미터를 내보냄
    //socket.emit({id:clients.client.id});
    const param = {
        id: clients.client.id,
        msg: chatInput.value
        }
        socket.emit("chatting", param)
    }
    sendButton.addEventListener("click", send)



chatInput.addEventListener("keypress", (event) => {
    if (event.keyCode === 13) {
        send()
    }
})


socket.on("chatting", (data) => {
    const { id, msg, time } = data; // data.id, data.msg, data.time
    const item = new LiModel(id, msg, time);
    item.makeLi()
    displayContainer.scrollTo(0, displayContainer.scrollHeight)
})

function LiModel(id, msg, time) {
    this.id = id;
    this.msg = msg;
    this.time = time;

    this.makeLi = () => {
        const li = document.createElement("li");
        li.classList.add(clients.client.id === this.id ? "sent" : "received")
        const dom = `<span class="profile">
            <span class="user"></span>
        </span>
        <span class="message">${this.msg}</span>
        <span class="time">${this.time}</span>`;
        li.innerHTML = dom;
        chatList.appendChild(li);
    }
}

function BtnClick(link) {
    location.assign(link);
}

function openModal() {
    document.getElementById("modal_id").style.display = "flex";
}

function closeModal() {
    document.getElementById("modal_id").style.display = "none";
}
