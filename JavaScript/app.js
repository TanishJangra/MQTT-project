document.addEventListener('DOMContentLoaded', function () {
  // Establish MQTT connection using HiveMQ public broker
  const broker = 'broker.hivemq.com';
  const port = 8000; // You can use port 1883 as well
  const currentUsername = JSON.parse(localStorage.getItem('currentLoggedInUser')) || {};
  const clickedUsername = JSON.parse(localStorage.getItem('selectedUser')) || {};
  const client = new Paho.MQTT.Client(broker, port, `clientId_${currentUsername.fullName}_${Date.now()}`);
  console.log(currentUsername.fullName,clickedUsername.fullName);
 
  // Set the topic for publishing and subscribing
  const publishTopic = `chat/${currentUsername.fullName}/${clickedUsername.fullName}`;
  const subscribeTopic = `chat/${clickedUsername.fullName}/${currentUsername.fullName}`;

  console.log(publishTopic, subscribeTopic)

  // Set the chat header text
  const chatHeader = document.getElementById('chatHeader');
  chatHeader.textContent = `Chat with ${clickedUsername.fullName}`;

  // Function to send a message
  function sendMessage(message) {
      // Publish the message to the selected user's topic
      const messagePayload = JSON.stringify({ sender: currentUsername.fullName, message: message });
      client.send(publishTopic, messagePayload);

      // Update the current logged-in user's chatbox
      updateChat(currentUsername.fullName, message, true);

      // For demonstration purposes, you can update your chat UI with the sent message
      console.log(`Sent message to ${clickedUsername.fullName}: ${message}`);
  }

  // Function to update the chat UI with a message
  function updateChat(username, message, isCurrentUser) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    
    // Use different classes for styling based on whether the message is from the current user or not
    messageDiv.className = isCurrentUser ? 'own-message' : 'other-message';
    
    messageDiv.textContent = `${username}: ${message}`;
    chatMessages.appendChild(messageDiv);
}

  // Subscribe to both current user's and clicked user's topics
  client.onConnectionLost = function (responseObject) {
      if (responseObject.errorCode !== 0) {
          console.error(`Connection lost: ${responseObject.errorMessage}`);
      }
  };

  client.onMessageArrived = function (message) {
    // Handle incoming messages
    const messageData = JSON.parse(message.payloadString);

    // Check if the message is not sent by the current user
    if (messageData.sender !== currentUsername.fullName) {
        // Update your chat UI with the received message
        updateChat(messageData.sender, messageData.message, false);
    }
};


  let options = {
      useSSL: false, // Change to true if the broker supports secure WebSocket
      onSuccess: function () {
          console.log("Connected to the MQTT broker");

          // Subscribe to the unique topic for messages sent to the current user
          client.subscribe(subscribeTopic);

          // Subscribe to the unique topic for messages sent to the clicked user
          client.subscribe(publishTopic);
      },
      onFailure: function (responseObject) {
          console.error("Failed to connect to the MQTT broker. Error: " + responseObject.errorMessage);
          // Handle failure, you might want to display a message to the user
      }
  };

  client.connect(options);

  // Example usage: Call sendMessage function when the send button is clicked
  document.getElementById('sendButton').addEventListener('click', function () {
      const messageInput = document.getElementById('messageInput');
      const message = messageInput.value.trim();

      if (message !== '') {
          sendMessage(message);

          // Clear the input field after sending the message
          messageInput.value = '';
      }
  });
});
  