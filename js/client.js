const socket = io('http://localhost:8000');

const form = document.getElementById("send-container");
const messageInput = document.getElementById("messageInp");
const messageContainer = document.querySelector('.container');
const append   = (message , position)=>{
    var audio =new  Audio("ting.mp3")
    const messageElement = document.createElement("div");
    messageElement.innerText = message;
    messageElement.classList.add('message')
    messageElement.classList.add(position)
    messageContainer.append(messageElement);
    if(position == 'left'){
        audio.play();

    }
    messageContainer.scrollTo(0,10000000);
}

form.addEventListener('submit',(e)=>{
    e.preventDefault();
    
    const message = messageInput.value;
    if(message){
    append(`You: ${message}`,'right')
    socket.emit('send', message);
    messageInput.value = "";
    console.log(messageContainer.innerHeight)
    }
})

const name = prompt("Enter your name to join ");
socket.emit("new-user-joined" , name);
socket.on('user-joined', name=>{
    append(`${name} joined the chat` , 'left') 
})
socket.on('receive', data=>{
    append( `${data.name} :${data.message}`, 'left')
})
socket.on('leave', data=>{
    append( `${data} Left the chat`, 'left')
})