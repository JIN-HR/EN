const express = require('express');
const http = require('http')
const app = express();
const path = require("path");
const server = http.createServer(app)
const socketIo = require("socket.io");
const io = socketIo(server);
const port = process.env.PORT || 3000

const finding = 1;
const notFinding = 2;
const chating = 3;

let clients = []; //사용자를 저장,관리하는 배열. 배열의 길이가 사용자의 수.
let clients_element = {
    name: "",
    client: "", //사용자의 소켓
    roomName: "", // 사용자가 들어가 있는 방 이름
    status: "", // 사용자의 상태.
    mbti: "", // 사용자의 mbti
    topic: "", // 사용자가 선택한 주제
    othermbti: "" // 상대의 mbti
};

app.get('/', function(req,res) {
    res.sendFile(__dirname + "/public/index.html")
})
app.use(express.static('public'))

server.listen(port, () => console.log(`Server running on port ${port}`));


//connention 이벤트는 소켓서버에 접속했을 때 발생
io.sockets.on("connection", function(socket){

    //클라이언트에서 "nickNameCheck"가 넘어왔을 때
    socket.on("nickNameCheck", function(data){
        //닉네임 입력 안 했을 때
        if(!data.name){
            socket.emit("nullError", "닉네임을 입력해주세요");
            return;
        }
        
        //같은  닉네임이 있을 때
        for(let a=0; a<clients.length; a++){
            if(clients[a].name == data.name){
                socket.emit("sameNameError", "동일한 닉네임이 존재합니다.");
                return;
            }
        }
        
        //사용자 정보 clients_element객체에 추가
        clients_element.name = data.name;
        clients_element.client = socket;
        clients_element.roomName ="";
        clients_element.status = notFinding;
        clients_element.mbti = data.mbti;
        socket.name = data.name;
        socket.emit("nickNameCheckComplete")
    })
    socket.on("topicCheck", function(data){
        //사용자 정보 clients_element객체에 추가
        clients_element.topic = data.topic;
        clients_element.othermbti = data.othermbti;

        //전체 정보 clients 배열에 추가
        clients.push({...clients_element});
        console.log(clients);
        socket.emit("topicCheckComplete")
    })

    //클라이언트에서 "matchClick" 이벤트가 발생했을 때
    socket.on("matchClick", function(data){
        for(let a=0; a<clients.length; a++){
            if(clients[a].name == data.name){
                clients[a].status = finding;
                console.log(clients);
                socket.emit("matchClickComplete");
                return;
            }
        }
    })

    //클라이언트에서 "randomMatching" 이벤트가 발생했을 때
    socket.on("randomMatching", function(data){
        for(let a=0; a<clients.length; a++){
            if(clients[a].status == finding){
                if(clients[a].name == data.name){
                    //상태가 finding인 사람이 본인일 때는 그냥 넘어가도록
                    continue;
                }else{
                    for(let i=0; i<clients.length; i++){
                        if(clients[a].name == clients[i].name){
                            break;
                        }else{
                            if(clients[a].topic == clients[i].topic && clients[a].othermbti == clients[i].mbti && clients[a].mbti == clients[i].othermbti){
                                let roomName = new Date().getTime()+"";
                                clients[a].status = chating;
                                clients[a].roomName = roomName;
                                clients[a].client.join(roomName);
        
                                for(let a=0; a<clients.length; a++){
                                    if(clients[a].name == data.name){
                                        clients[a].status = chating;
                                        clients[a].roomName = roomName;
                                        clients[a].client.join(roomName);
                                        io.sockets.to(roomName).emit("matchingComplete", roomName);
                                        console.log(clients);
                                        return;
                                    }
                                }
                            }else{
                                continue;
                            }
                        }
                    }

                }
            
            }
        }
    })
});