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
        AlexaComms.start(this.config, function(toModule, topic, payload) {
            var theModule = (toModule !== undefined && toModule != null ? toModule : '');
            console.log("Got topic: "+ topic + " for module "+ theModule);
            var address = theModule+':'+topic;
            self.sendSocketNotification(topic, payload);
        });
    },
    
    // --------------------------------------- Handle notifications
    socketNotificationReceived: function(notification, payload) {
        const self = this;
        if (notification === 'CONFIG' && this.started == false) {
		    this.config = payload;	     
		    this.started = true;
            this.startAlexa();
        };
    }

});