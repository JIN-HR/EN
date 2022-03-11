/* server */

const express = require("express"); // 라이브러리 가져옴
const http = require("http");
const moment = require("moment");
const chat = express(); // express 실행 내용을 server에 담음 
const path = require("path")
const server = http.createServer(chat)
const socketIO = require("socket.io")
const io = socketIO(server);

chat.use(express.static(path.join(__dirname, "src")))
const PORT = process.env.PORT || 5000;


io.on("connection", (socket) => {
    socket.on("chatting", (data) => {
        const { id, msg } = data;
        io.emit("chatting", {
            id,
            msg,
            time: moment(new Date()).format("h:mm A")
        })
    })
})

chat.get('/*', function(req, res) {
        res.sendFile(path.resolve(__dirname, "src", 'chat.html'))
    }) // Cannot get/ << error 해결 !!!
server.listen(PORT, () => console.log(`server is running ${PORT}`))
        // npm install -g nodemon : 변경이 있을 때마다 자동으로 새로고침 해줌