let selectedUser;
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

  // Get current logged-in user and selected user from local storage
  const currentLoggedInUser = JSON.parse(localStorage.getItem("currentLoggedInUser"));
   selectedUser = JSON.parse(localStorage.getItem("selectedUser"));

  // Set the chat header with the selected user's name
  chatHeader.textContent = selectedUser.fullName;

  // Connect to MQTT broker when the page loads
  connectToMQTT(currentLoggedInUser.fullName);

  function handleSendMessage() {
    const newMessage = messageInput.value.trim();
    if (newMessage === "") return;

    // Display the sent message on the current user's chat UI
    const sentMessage = { text: newMessage, sender: "user" }; // Assuming the sender is the current user
    messages.push(sentMessage);
    displayMessages();

    // Publish the message to the MQTT broker
    publishMessage(newMessage);

    // Clear the input field
    messageInput.value = "";
  }

  function handleCloseChat() {
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

function onConnectionLost(responseObject) {
  console.error("Connection lost:", responseObject.errorMessage);
}

function onMessageArrived(message) {
  const sender = message.destinationName.split('/')[1];  // Extract sender from the topic

  // Display received messages on the selected user's chat UI
  const receivedMessage = { text: message.payloadString, sender: sender };
  messages.push(receivedMessage);
  displayMessages();
}

function connectToMQTT(username) {
  window.clientID = "clientID - " + parseInt(Math.random() * 100);
  window.host = "test.mosquitto.org"; // Replace with your MQTT broker host
  window.port = 8080; // Replace with your MQTT broker port

  console.log("Creating client...");
  window.client = new window.Paho.Client(window.host, Number(window.port), "abcd");

  window.client.onConnectionLost = onConnectionLost;
  window.client.onMessageArrived = onMessageArrived;

  window.client.connect({
    onSuccess: () => onConnect(username),
    userName: username,  // Use the current user's name as the username
    password: "your_mqtt_password" // Replace with your MQTT broker password
  });
}

function onConnect(username) {
  const topic = `chat/${selectedUser.fullName}`; // Use the selected user's name as the topic
  console.log("Subscribing to topic " + topic);
  window.client.subscribe(topic);

  // Subscribe the selected user to the topic where the current user publishes messages
  const senderTopic = `chat/${currentLoggedInUser.fullName}`;
  console.log("Subscribing selected user to sender topic " + senderTopic);
  window.client.subscribe(senderTopic);
}

function publishMessage(message) {
  const topic = `chat/${selectedUser.fullName}`;
  console.log("Publishing message...");

  // Check if the client is connected before sending the message
  if (window.client.isConnected()) {
    var messageObject = new Paho.MQTT.Message(message);
    messageObject.destinationName = topic;

    window.client.send(messageObject);

    console.log("Message published:", message);
  } else {
    console.error("MQTT client is not connected. Unable to publish message.");
  }
}

