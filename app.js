const { Socket } = require("dgram");
const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT||7004;
const server = app.listen(PORT,()=>console.log("Listening on http://localhost:"+PORT));

const io = require('socket.io')(server);

//set the public folder as a static directory for the app
app.use(express.static(path.join(__dirname,"public")));

let socketConnections = new Set();//unique connections

//listen to event connection event on the web server
io.on('connection',onConnected)

function onConnected(socket)
{
    console.log(socket.id);
    socketConnections.add(socket.id);

    //handle the event clients-total on main.js
    io.emit("clients-total",socketConnections.size);

    socket.on("disconnect",()=>{
        console.log("socket disconnected",socket.id);
        socketConnections.delete(socket.id);
        io.emit("clients-total",socketConnections.size);
        
    });

    //handle message event
    socket.on("message",(data)=>{
        console.log(data);
        socket.broadcast.emit("chat-msg",data);
    });

    socket.on("feedback",(data)=>{
        socket.broadcast.emit("feedback",data);
    })
}

