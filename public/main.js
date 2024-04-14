//make a connection to web socket server
//web socket server is connected to window.location url
const socket =io()
const numOfClients = document.getElementById("clients-total");
const messageContainer = document.getElementById("message-container");
const nameInput = document.getElementById("name-input");
const chatForm = document.getElementById("message-form");
const inputMessage = document.getElementById("message-input");

//
//event handling 
socket.on("clients-total",(data)=>{
    numOfClients.innerText = `Clients: ${data}`;
    //comment
});

chatForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    sendMsg();
});

function sendMsg(){
    if(inputMessage.value ==='')return
    console.log(inputMessage.value);
    //data json object to be sent to the server
    const data={
        name:nameInput.value,
        message:inputMessage.value,
        dateTime:new Date(),
    }
    //to send the message emit an event
    socket.emit('message',data);
    addMsgToUI(true,data);
    inputMessage.value = '';
}

//the reciver of the message
//to show the message to all clients
socket.on("chat-msg",(data)=>{
    console.log(data);
    addMsgToUI(false,data);
})

function addMsgToUI(isMyMsg,data)
{
    clearFeedback();
    const element = `<li class="${isMyMsg?"message-right":"message-left"}">
        <p class="message">
             ${data.message}
            <span>"${data.name} date: ${moment(data.dateTime).fromNow()}"</span>
        </p>
        </li>`

    messageContainer.innerHTML+=element;
    automaticScroll();
}

function automaticScroll()
{
    messageContainer.scroll(0,messageContainer.scrollHeight);
};

inputMessage.addEventListener("focus",(e)=>{
    socket.emit("feedback",{
        feedback: `${nameInput.value} is typing...`
    })
});


inputMessage.addEventListener("blur",(e)=>{
    socket.emit("feedback",{
        feedback: ''
    })
});

socket.on("feedback",(data)=>{
    //clear the prev feedback
    clearFeedback();
    const element = `<li class="message-feedback">
                        <p class="feedback" id="feedback">
                            ${data.feedback}
                        </p>
                    </li>`;
    messageContainer.innerHTML += element;
});

//clear the feedback after typing
function clearFeedback(){
    document.querySelectorAll("li.message-feedback").forEach(element =>{
        element.parentNode.removeChild(element)
    })
}