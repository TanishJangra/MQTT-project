// mqtt-sender.js
const mqtt = require('mqtt');

const client = mqtt.connect("mqtt://broker.hivemq.com");

client.on("connect", function () {
    setInterval(() => {
        // Send user input as a message
        const userInput = "User1: " + new Date().toLocaleTimeString();
        client.publish("topic-chat", userInput);
    }, 1000);
});
