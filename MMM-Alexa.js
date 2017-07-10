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
            var div = document.createElement("div");
			div.innerHTML = this.name + " loading feeds ...";
			div.className = "dimmed light small";
			wrapper.appendChild(div);
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
            div.innerHTML = "Service: "+ this.failure;
            div.style.color = "red"; // TODO Change this to a custom style
            wrapper.appendChild(div);
        }

        return wrapper;
    },

    // --------------------------------------- Handle socketnotifications
    socketNotificationReceived: function(notification, payload) {
        Log.info("Got notification: "+notification);
        //alert('1:' + JSON.stringify(payload));
        //debugger;
        if (notification == "HELLO") {
            this.loaded = true;
            this.message = payload;
            this.updateDom();
        }
        else if (notification == "SERVICE_FAILURE") {
            this.failure = payload;
            Log.info("Service failure: "+ this.failure);
            this.updateDom();
        } else {
            this.loaded = true;
            this.message = "Got notification '"+notification + "' " + JSON.stringify(payload);
            this.updateDom();
        }
    },

});
