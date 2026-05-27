const chatForm = document.getElementById("chatForm");

const messageInput = document.getElementById("messageInput");

const messages = document.getElementById("messages");

chatForm.addEventListener("submit", (e) => {

  e.preventDefault();

  const text = messageInput.value.trim();

  if(text === "") return;

  const messageDiv = document.createElement("div");

  messageDiv.classList.add("message", "mine");

  messageDiv.innerHTML = `
  
    <div class="message-info">
      <strong>You</strong>
      <span>${new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })}
      </span>
    </div>

    <div class="message-bubble">
      ${text}
    </div>
  `;

  messages.appendChild(messageDiv);

  messages.scrollTop = messages.scrollHeight;

  messageInput.value = "";

});