const express = require("express");
const http = require("http"); // Add the http module
const socketIo = require("socket.io");
// const cors = require("cors");
const app = express();
const server = http.createServer(app); // Create an HTTP server using the express app
const io = socketIo(server); // Attach Socket.IO to the HTTP server
app.use(express.static(__dirname + '/public'));
const port = process.env.PORT || 7000; 
const users = {};
// io.use(cors()); 
io.on('connection', socket => { 
    socket.on('new-user-joined', name => {
        users[socket.id] = name;
        console.log("new user", name);
        socket.broadcast.emit('user-joined', name);
    });

    socket.on('send', message => {
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
    });

    socket.on('disconnect', message => {
        socket.broadcast.emit('leave', users[socket.id]);
        delete users[socket.id];
    }); 
});

app.get('/', (req, res) => { 
    res.sendFile(__dirname + '/index.html');
});

server.listen(port, () => {
    console.log(`Server is running on port = ${port}`);
});
