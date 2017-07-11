/* node_helper.js
 *
 * Magic Mirror module - Alexa integration. 
 * 
 * Magic Mirror
 * Module: MMM-Alexa
 * 
 * Magic Mirror By Michael Teeuw http://michaelteeuw.nl
 * MIT Licensed.
 * 
 * Module MMM-Alexa By Anders Boghammar
 */
const NodeHelper = require("node_helper");
const AlexaComms = require("./AlexaComms");

module.exports = NodeHelper.create({
    // --------------------------------------- Start the helper
    start: function() {
        console.log('Starting helper: '+ this.name);
        this.started = false;
    },

    // --------------------------------------- Start the Alexa integration
    startAlexa: function() {
        var self = this;
        AlexaComms.start(this.config, function(toModule, aTopic, payload) {
            var theModule = (toModule !== undefined && toModule != null ? toModule : '');
            console.log("MMM-Alexa: Got topic: "+ aTopic + " for module "+ theModule);
            var noHandler = true;
            self.config.topics.forEach(function(topic) {
                if (topic.module == theModule) {
                    console.log("MMM-Alexa: Sending topic: "+topic.topic + ' to module:'+topic.module);
                    topic.handler.handleTopic(aTopic, payload);
                    noHandler = false;
                }
            }, this);
            if (noHandler) { // Send it to the ui so that it can do something with it
                var address = theModule+':'+aTopic;
                self.sendSocketNotification(aTopic, payload);
            }
        });
    },
    
    // --------------------------------------- Handle notifications
    socketNotificationReceived: function(notification, payload) {
        const self = this;
        if (notification === 'CONFIG' && this.started == false) {
		    this.config = payload;	     
		    this.started = true;
            // ------ Load all modules defined as topic handlers
            this.config.topics.forEach(function(topic) {
                console.log("MMM-Alexa: Loading handler for topic: "+topic.topic + ' module:'+topic.module);
                try {
                    topic.handler = require('./modules/'+topic.module+'/index.js');
                    topic.handler.helper = self;
                    if (topic.config !== undefined) topic.handler.init(topic.config);
                } catch (err) {
                    console.log("MMM-Alexa: Failed loading module: "+topic.module + " "+err);
                    self.sendSocketNotification("SERVICE_FAILURE", JSON.stringify(err));
                }
            });
            this.startAlexa();
        };
    }

});