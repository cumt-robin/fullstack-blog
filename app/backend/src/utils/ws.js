const fs = require("fs");
const socketIo = require("socket.io");

let io;

// function bloggerOnlineHandler() {
//     io.of('online').on('connection', function (socket) {

//     });
// }

function chatRoomHandler() {
    io.of("chatroom").on("connection", (socket) => {
        sendToSingle(socket, {
            event: "greet_from_server",
            data: {
                content: `hello，欢迎您加入在线聊天室！`,
            },
        });
        broadcastExceptSelf(socket, {
            event: "new_user_join",
            data: {
                user: socket.conn.id,
            },
        });
        socket.on("chat", (data) => {
            broadcastExceptSelf(socket, {
                event: "new_chat_content",
                data: {
                    user: socket.conn.id,
                    content: data,
                },
            });
        });
        socket.on("disconnect", (reason) => {
            broadcastExceptSelf(socket, {
                event: "someone_exit",
                data: {
                    user: socket.conn.id,
                },
            });
        });
    });
}

function videoStreamHandler() {
    io.of("videostream").on("connection", (socket) => {
        const filePath = "public/videos/frag_bunny.mp4";
        let dataBuffer = "";
        let size = 0;
        let totalSize = 0;
        const buffers = [];
        const readStream = fs.createReadStream(filePath);
        readStream.on("data", (data) => {
            // console.log(data)
            dataBuffer += data;
            size += data.length;
            totalSize += data.length;
            if (size >= 500000) {
                buffers.push(dataBuffer);
                dataBuffer = "";
                size = 0;
            }
        });
        readStream.on("end", () => {
            buffers.push(dataBuffer);
        });
        socket.on("keepalive", () => {
            if (buffers.length > 0) {
                socket.emit("streaming", buffers.shift());
            } else {
                socket.emit("loading");
            }
        });
        socket.on("disconnect", (reason) => {
            console.log(reason);
        });
    });
}

function sendToSingle(socket, param) {
    socket.emit("singleMsg", param);
}

function broadcastAll(param) {
    io.emit("broadcastAll", param);
}

function broadcastExceptSelf(socket, param) {
    socket.broadcast.emit("broadcast", param);
}

function startWs(server) {
    io = socketIo(server);
    chatRoomHandler();
}

module.exports.startWs = startWs;
