// mqtt-receiver.js
const mqtt = require('mqtt');

const client = mqtt.connect("mqtt://broker.hivemq.com");

client.on('connect', function () {
    client.subscribe('topic-chat');
    console.log('mqtt client subscribed successfully');
});

client.on('message', function (topic, message) {
    console.log(message.toString());

    // Handle the received message (update chat UI, etc.)
    const receivedMessage = message.toString();
    // You can implement your own logic to update the chat UI with the received message
    // For now, let's just log it to the console
    console.log("Received message:", receivedMessage);
});
