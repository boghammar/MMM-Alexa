'use strict'
/* AlexaComms.js
 *
 * Magic Mirror module - Alexa integration using the AWS IOT Gateway. 
 * 
 * Magic Mirror
 * Module: MMM-Alexa
 * 
 * Magic Mirror By Michael Teeuw http://michaelteeuw.nl
 * MIT Licensed.
 * 
 * Module MMM-Alexa By Anders Boghammar
 */
const awsIot = require('aws-iot-device-sdk');

var app = {};

// Setup our AWS IoT device and receive messages
app.start = function(config, callback) {
    var self = this;
    app.config = config;
    app.callback = callback;

    // ----- Create our device
    app.device = awsIot.device({
        keyPath: __dirname + "/certs/MagicMirror.private.key",
        certPath: __dirname + "/certs/MagicMirror.cert.pem",
        caPath: __dirname + "/certs/root-CA.crt",
        clientId: "MagicMirror" + (new Date().getTime()),
        region: "us-east-1",
    });

    // ----- Setup connect handler
    app.device.on("connect", function() {
        console.log("Connected to AWS IoT");

        // --- Register subscriptions
        for (var ix = 0; ix < self.config.topics.length; ix++) {
            self.device.subscribe(self.config.topics[ix]);
            console.log("Subscribed: " + self.config.topics[ix]);
        }

        self.callback(null, "HELLO", "Connected to AWS IOT and registered all subscriptions");
        
    });

    // --- Setup message listener
    app.device.on("message", function(topic, payload) {
        console.log("AjaxComms got: " + topic + " " + payload);
        var JSONpayload = JSON.parse(payload.toString());
        var toModule = (JSONpayload.module !== undefined && JSONpayload.module != null ? JSONpayload.module : null);
        self.callback(toModule, topic, JSONpayload.body);
    });
}

module.exports = app;