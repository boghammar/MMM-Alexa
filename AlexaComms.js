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

// ---------------------------------- Setup our AWS IoT device and receive messages
app.start = function(config, callback) {
    var self = this;
    app.config = config;
    app.callback = callback;

    // ----- Create our device
    try {
        var opt = {
            keyPath: self.config.certPath + "/" + self.config.certID + "-private.pem.key",
            certPath: self.config.certPath + "/" + self.config.certID +  "-certificate.pem.crt",
            caPath: self.config.certPath + "/root-CA.crt",
            clientId: "MagicMirror" + (new Date().getTime()),
            region: "us-east-1",
            host: 'apt0pfcp3wbpr.iot.us-east-1.amazonaws.com'
        }
        console.log("Creating device:\n\tkeyPath="+opt.keyPath+"\n\tcertPath="+opt.certPath);
        console.log("These are the topics:"+JSON.stringify(self.config.topics));
        var fs = require('fs');
        if (!fs.existsSync(opt.certPath)) console.log(opt.certPath+" DOES NOT EXIST")
        
        app.device = awsIot.device(opt);

        // ----- Setup connect handler
        app.device.on("connect", function() {
            console.log("Connected to AWS IoT");

            // --- Register subscriptions
            for (var ix = 0; ix < self.config.topics.length; ix++) {
                self.device.subscribe(self.config.topics[ix].topic);
                console.log("Subscribed to: '" + self.config.topics[ix].topic+"'");
            }

            self.callback(null, "HELLO", "Connected to AWS IOT and registered all subscriptions");
            
        });

        // --- Setup message listener
        app.device.on("message", function(topic, payload) {
            console.log("AjaxComms got: " + topic + " " + payload);
            var JSONpayload = JSON.parse(payload);
            var toModule = (JSONpayload.module !== undefined && JSONpayload.module != null ? JSONpayload.module : null);
            self.callback(toModule, topic, JSONpayload.body);
        });
    } catch(err) {
        console.log("AlexaComms - SERVICE_FAILURE: " + JSON.stringify(err), err);
        self.callback(null, "SERVICE_FAILURE", "AlexaComms.start() " + err.message);
    }
}

app.publish = function(topic, payload) {
    var str = JSON.stringify(payload);
    this.device.publish(topic, str);
    console.log("Publish: '" + topic+"' "+str);
}

app.subscribeto = function(topic) {
    this.config.topics.push(topic);
    this.device.subscribe(topic);
    console.log("Subscribed to: '" + topic+"'");
}

module.exports = app;