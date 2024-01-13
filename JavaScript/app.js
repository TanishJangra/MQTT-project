// // @ts-nocheck

// const johnSelectorBtn = document.querySelector('#john-selector')
// const janeSelectorBtn = document.querySelector('#jane-selector')
// const chatHeader = document.querySelector('.chat-header')
// const chatMessages = document.querySelector('.chat-messages')
// const chatInputForm = document.querySelector('.chat-input-form')
// const chatInput = document.querySelector('.chat-input')
// const clearChatBtn = document.querySelector('.clear-chat-button')

// const messages = JSON.parse(localStorage.getItem('messages')) || []

// const createChatMessageElement = (message) => `
//   <div class="message ${message.sender === 'John' ? 'blue-bg' : 'gray-bg'}">
//     <div class="message-sender">${message.sender}</div>
//     <div class="message-text">${message.text}</div>
//     <div class="message-timestamp">${message.timestamp}</div>
//   </div>
// `

// window.onload = () => {
//   messages.forEach((message) => {
//     chatMessages.innerHTML += createChatMessageElement(message)
//   })
// }

// let messageSender = 'John'

// const updateMessageSender = (name) => {
//   messageSender = name
//   chatHeader.innerText = `${messageSender} chatting...`
//   chatInput.placeholder = `Type here, ${messageSender}...`

//   if (name === 'John') {
//     johnSelectorBtn.classList.add('active-person')
//     janeSelectorBtn.classList.remove('active-person')
//   }
//   if (name === 'Jane') {
//     janeSelectorBtn.classList.add('active-person')
//     johnSelectorBtn.classList.remove('active-person')
//   }

//   /* auto-focus the input field */
//   chatInput.focus()
// }

// johnSelectorBtn.onclick = () => updateMessageSender('John')
// janeSelectorBtn.onclick = () => updateMessageSender('Jane')

// const sendMessage = (e) => {
//   e.preventDefault()

//   const timestamp = new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
//   const message = {
//     sender: messageSender,
//     text: chatInput.value,
//     timestamp,
//   }

//   /* Save message to local storage */
//   messages.push(message)
//   localStorage.setItem('messages', JSON.stringify(messages))

//   /* Add message to DOM */
//   chatMessages.innerHTML += createChatMessageElement(message)

//   /* Clear input field */
//   chatInputForm.reset()

//   /*  Scroll to bottom of chat messages */
//   chatMessages.scrollTop = chatMessages.scrollHeight
// }

// chatInputForm.addEventListener('submit', sendMessage)

// clearChatBtn.addEventListener('click', () => {
//   localStorage.clear()
//   chatMessages.innerHTML = ''
// })

window.onload = function() {
  var urlParams = new URLSearchParams(window.location.search);
  var username = urlParams.get('username');

  // Set the chat header with the username
  document.getElementById("chatHeader").textContent = username;
};

document.addEventListener("DOMContentLoaded", function() {
  const chatWindow = document.getElementById("chatWindow");
  const closeButton = document.getElementById("closeButton");
  const chatHeader = document.getElementById("chatHeader");
  const chatMessages = document.getElementById("chatMessages");
  const messageInput = document.getElementById("messageInput");
  const sendButton = document.getElementById("sendButton");

  let messages = [];

  closeButton.addEventListener("click", handleCloseChat);

  sendButton.addEventListener("click", handleSendMessage);

  function handleSendMessage() {
      const newMessage = messageInput.value.trim();
      if (newMessage === "") return;

      // Simulate receiving a message from the bot
      const receivedMessage = { text: newMessage, sender: "bot" };
      messages.push(receivedMessage);
      displayMessages();

      // Clear the input field
      messageInput.value = "";
  }

  function handleCloseChat() {
      // Simulate closing the chat window
      chatWindow.style.display = "none";
  }

  function displayMessages() {
      chatMessages.innerHTML = ""; // Clear previous messages

      messages.forEach((message) => {
          const messageElement = document.createElement("div");
          messageElement.className = `message ${message.sender}`;
          messageElement.textContent = message.text;
          chatMessages.appendChild(messageElement);
      });

      // Scroll to the bottom when new messages are added
      chatMessages.scrollTop = chatMessages.scrollHeight;
  }
});
