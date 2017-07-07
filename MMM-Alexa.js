/* MMM-Alexa.js
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

 Module.register('MMM-Alexa', {

     defaults: {},

    // --------------------------------------- Start the module
    start: function() {
        Log.info("Starting module: " + this.name);
        var self = this;

        this.loaded = false;
        this.sendSocketNotification('CONFIG', this.config); // Send config to helper and initiate an update
    },

    // --------------------------------------- Generate dom for module
    getDom: function() {
        var wrapper = document.createElement("div");

        if (!this.loaded) {
			wrapper.innerHTML = this.name + " loading feeds ...";
			wrapper.className = "dimmed light small";
			return wrapper;
		}
        // ----- Show a message if we got any
        if (this.message !== undefined) {
            var div = document.createElement("div");
            div.innerHTML = this.message;
            wrapper.appendChild(div);
        }

        // ----- Show service failure if any
        if (this.failure !== undefined) {
            var div = document.createElement("div");
            div.innerHTML = "Service: "+this.failure.StatusCode + '-' + this.failure.Message;
            div.style.color = "red"; // TODO Change this to a custom style
            wrapper.appendChild(div);
        }

        return wrapper;
    },

    // --------------------------------------- Handle socketnotifications
    socketNotificationReceived: function(notification, payload) {
        if (notification == "HELLO") {
            this.loaded = true;
            this.message = payload;
            this.updateDom();
        }
        if (notification == "SERVICE_FAILURE") {
            this.failure = payload;
            Log.info("Service failure: "+ this.failure.StatusCode + ':' + this.failure.Message);
            this.updateDom();
        }
    },

});