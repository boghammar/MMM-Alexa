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

sonos.handleTopic = function(topic, payload) {
    console.log("SonosPlay - Topic:" + topic + " Payload:"+JSON.stringify(payload));

    switch (payload.action) {
        case 'play': this.play(payload); break;
        case 'resume': this.resume(payload); break;
        case 'stop': this.stop(payload); break;
        default: console.log("Unknown action "+payload.action); break;
    }

    if (this.helper !== undefined) this.helper.sendSocketNotification("HELLO", "Have "+payload.action+": "+JSON.stringify(payload));
}

// ------------------------------------------------------------- Module specific stuff
sonos.play = function(payload) {
    var self = this;
    var opt = {
        uri: this.config.url + '/' + payload.where + '/play',
        json: true
    }
    request(opt)
        .then(function(resp){
            console.log('SonosPlay - respstatus' + resp.StatusCode)
            if (resp.StatusCode == 0) {
                // TODO handle the ok response
            } else {
                console.log("Play: Something went wrong: " + resp.StatusCode + ': '+ resp.Message);
                self.helper.sendSocketNotification('SERVICE_FAILURE', resp); 
            }
        })
        .catch(function(err) {
                console.log('Play: Problems: '+err);
                self.helper.sendSocketNotification('SERVICE_FAILURE', err); 
        });
}

// ------------------------------------------------------------- Resume playing
sonos.resume = function(payload) {
    var self = this;
    var opt = {
        uri: this.config.url + '/' + payload.where + '/play',
        json: true
    }
    request(opt)
        .then(function(resp){
            console.log('SonosPlay - response status: ' + JSON.stringify(resp))
            if (resp.StatusCode == 0) {
                // TODO handle the ok response
            } else {
                console.log("Resume: Something went wrong: " + resp.StatusCode + ': '+ resp.Message);
                self.helper.sendSocketNotification('SERVICE_FAILURE', resp); 
            }
        })
        .catch(function(err) {
                console.log('Resume: Problems: '+err);
                self.helper.sendSocketNotification('SERVICE_FAILURE', err); 
        });
}

// ------------------------------------------------------------- Stope playing
sonos.stop = function(payload) {
    var self = this;
    var opt = {
        uri: this.config.url + '/' + payload.where + '/pause',
        json: true
    }
    request(opt)
        .then(function(resp){
            console.log('SonosPlay - respstatus' + resp.StatusCode)
            if (resp.StatusCode == 0) {
                // TODO handle the ok response
            } else {
                console.log("Stop: Something went wrong: " + resp.StatusCode + ': '+ resp.Message);
                self.helper.sendSocketNotification('SERVICE_FAILURE', resp); 
            }
        })
        .catch(function(err) {
                console.log('Stop: Problems: '+err);
                self.helper.sendSocketNotification('SERVICE_FAILURE', err); 
        });
}

module.exports = sonos;