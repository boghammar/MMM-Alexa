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
        default: console.log("Unknown action "+payload.action); break;
    }

    if (this.helper !== undefined) this.helper.sendSocketNotification("HELLO", "Have started "+payload);
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
                console.log("Something went wrong: " + resp.StatusCode + ': '+ resp.Message);
                self.helper.sendSocketNotification('SERVICE_FAILURE', resp); 
            }
        })
        .catch(function(err) {
                console.log('Problems: '+err);
                self.helper.sendSocketNotification('SERVICE_FAILURE', err); 
        });
}

module.exports = sonos;