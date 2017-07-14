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
            // -------------- First try our own handler modules
            self.handlers.forEach(function(handler) {
                if (handler.module == theModule) {
                    console.log("MMM-Alexa: Sending topic: "+handler.topic + ' to module:'+handler.module);
                    handler.handler.handleTopic(aTopic, payload);
                    noHandler = false;
                }
            }, this);
            if (noHandler) { // Send it to the ui so that it can do something with it
                var address = theModule+':'+aTopic;
                console.log("MMM-Alexa: Sending topic: "+address);
                self.sendSocketNotification(address, payload);
            }
        });
    },
    
    // --------------------------------------- Handle notifications
    socketNotificationReceived: function(notification, payload) {
        const self = this;
        if (notification === 'CONFIG' && this.started == false) {
		    this.config = payload;	     
            console.log("This is the config:"+JSON.stringify(this.config));

            // ------ Load all modules defined as topic handlers
            this.handlers = [];
            this.config.topics.forEach(function(topic) {
                console.log("MMM-Alexa: Loading handler for topic: "+topic.topic + ' module:'+topic.module);
                try {
                    handler = require('./modules/'+topic.module+'/index.js');
                    handler.helper = self;
                    topic.topic = handler.TOPIC; 
                    if (topic.config !== undefined) handler.init(topic.config);
                    self.handlers.push({topic: topic.topic, handler: handler, module:topic.module});
                    //console.log("This is the handlers:"+JSON.stringify(self.handlers));
                    console.log("This is the topic:"+JSON.stringify(topic));
                } catch (err) {
                    console.log("MMM-Alexa: Failed loading module: "+topic.module + " "+err);
                    self.sendSocketNotification("SERVICE_FAILURE", JSON.stringify(err));
                }
            });
            console.log("This is the config:"+JSON.stringify(this.config));
            this.startAlexa();
		    this.started = true;
        }
        if (notification === 'SUBSCRIBETO' && this.started) {
            console.log("MMM-Alexa: Got notification: "+notification + " "+payload);
            AlexaComms.subscribeto(payload);
        }
        if (notification === 'PLAYVIDEO_RESPONSE' && this.started) {
            console.log("MMM-Alexa: Got notification: "+notification + " "+payload);
            AlexaComms.publish('PLAYVIDEO_RESPONSE', payload);
        }
    }

});