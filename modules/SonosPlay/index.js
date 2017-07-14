/* index.js for the MMM-Alexa module SonosPlay
 *
 * This one takes the payload from the Alexa Skill MMM-AlexaSkill and executes 
 * the play action on the selected Sonos device
 */
const request = require("request-promise");

var sonos = {};

sonos.init = function(cfg) {
    this.config = cfg;
    if (this.config.url === undefined) this.config.url = 'http://localhost:5005';
}

sonos.TOPIC = 'MagicMirror:Play';

sonos.handleTopic = function(topic, payload) {
    console.log("SonosPlay - Topic:" + topic + " Payload:"+JSON.stringify(payload));

    var error = '';
    switch (payload.action) {
        case 'play': this.play(payload); break;
        case 'next': this.next(payload); break;
        case 'resume': this.resume(payload); break;
        case 'stop': this.stop(payload); break;
        default: error = "SonosPlay Unknown action "+payload.action; console.log(error); break;
    }

    if (this.helper !== undefined) {
        if (error != '') this.helper.sendSocketNotification("SERVICE_FAILURE", error +": "
                +JSON.stringify(payload));
        else
            this.helper.sendSocketNotification("HELLO", "SonosPlay got action "+payload.action+": "
                +JSON.stringify(payload));
    }
}

// ------------------------------------------------------------- Module specific stuff
sonos.play = function(payload) {
    var self = this;
    this.request('/' + payload.where + '/play', 'play', function() {

    });
}

// ------------------------------------------------------------- Resume playing
sonos.resume = function(payload) {
    var self = this;
    this.request('/' + payload.where + '/play', 'resume', function() {

    });
}

// ------------------------------------------------------------- Stop playing
sonos.stop = function(payload) {
    var self = this;
    this.request('/' + payload.where + '/pause', 'pause', function() {

    });
}

// ------------------------------------------------------------- Skip to next
sonos.next = function(payload) {
    var self = this;
    this.request('/' + payload.where + '/next', 'next', function() {

    });
}

// ------------------------------------------------------------- Generic request to the http-sonos
sonos.request = function(path, action, callback) {
    var self = this;
    var opt = {
        uri: this.config.url + path,
        json: true
    }
    request(opt)
        .then(function(resp){
            console.log('SonosPlay - '+action +' response status' + resp.StatusCode)
            if (resp.StatusCode == 0) {
                callback();
            } else {
                console.log("SonosPlay - "+action +": Something went wrong: " + resp.StatusCode + ': '+ resp.Message);
                self.helper.sendSocketNotification('SERVICE_FAILURE', resp); 
            }
        })
        .catch(function(err) {
                console.log('SonosPlay - '+action +': Problems: '+err);
                if (err.cause.code == 'ECONNREFUSED') self.helper.sendSocketNotification('SERVICE_FAILURE', 'Connection refused to '+self.config.url);
                else self.helper.sendSocketNotification('SERVICE_FAILURE', err); 
        });

}

module.exports = sonos;