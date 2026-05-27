/* =========================
   CHAT SYSTEM
========================= */

const sendBtn =
document.getElementById(
"sendBtn"
);

const messageInput =
document.getElementById(
"messageInput"
);

const chatBody =
document.getElementById(
"chatBody"
);

const chatUsers =
document.querySelectorAll(
".chat-user"
);

const chatHeaderName =
document.querySelector(
".chat-header h3"
);

const chatHeaderImg =
document.querySelector(
".chat-header img"
);



/* =========================
   SEND ADMIN MESSAGE
========================= */

function sendMessage(){

    let text =
    messageInput.value.trim();

    if(text === ""){
        return;
    }

    const message =
    document.createElement(
    "div"
    );

    message.classList.add(
    "message",
    "sent"
    );

    message.innerHTML =
    text;

    chatBody.appendChild(
    message
    );

    messageInput.value = "";

    scrollBottom();

}



/* =========================
   BUTTON CLICK
========================= */

sendBtn.addEventListener(
"click",
sendMessage
);



/* =========================
   ENTER KEY SEND
========================= */

messageInput.addEventListener(
"keypress",
function(e){

    if(e.key === "Enter"){

        sendMessage();

    }

});



/* =========================
   AUTO SCROLL
========================= */

function scrollBottom(){

    chatBody.scrollTop =
    chatBody.scrollHeight;

}



/* =========================
   RECEIVE INSTANT MESSAGE
========================= */

function receiveMessage(text){

    const message =
    document.createElement(
    "div"
    );

    message.classList.add(
    "message",
    "received"
    );

    message.innerHTML =
    text;

    chatBody.appendChild(
    message
    );

    scrollBottom();

}



/* =========================
   FAKE LIVE MESSAGES
========================= */

setInterval(()=>{

    const replies = [

      "Okay Admin 👍",

      "Thank you!",

      "Can you help me?",

      "I submitted my project",

      "When is the next workshop?",

      "I need certificate help"

    ];

    let randomReply =

    replies[
      Math.floor(
      Math.random()
      * replies.length
      )
    ];

    receiveMessage(
      randomReply
    );

},15000);



/* =========================
   SWITCH USERS
========================= */

chatUsers.forEach((user)=>{

    user.addEventListener(
    "click",
    function(){

        document
        .querySelectorAll(
        ".chat-user"
        )
        .forEach((u)=>{

            u.classList.remove(
            "active"
            );

        });

        user.classList.add(
        "active"
        );

        let name =
        user.querySelector(
        "h3"
        ).innerHTML;

        let img =
        user.querySelector(
        "img"
        ).src;

        chatHeaderName.innerHTML =
        name;

        chatHeaderImg.src =
        img;

    });

});



/* =========================
   ONLINE STATUS
========================= */

const status =
document.createElement(
"span"
);

status.innerHTML =
" • Online";

status.style.color =
"#00b894";

status.style.fontSize =
"14px";

chatHeaderName.appendChild(
status
);