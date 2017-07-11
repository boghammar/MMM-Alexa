# MMM-Alexa
A Magic Mirror module that interacts with Alexa and has a modularized pluginsystem to add various skills.

Inspired by joanaz [MMM-MirrorMirrorOnTheWall](https://github.com/joanaz/MMM-MirrorMirrorOnTheWall).

It is a companion project to the actual Alexa Skill [MMM-AlexaSkill](https://github.com/boghammar/MMM-AlexaSkill). See that project on how to setup the communication between the MM module and the skill (it uses the AWS IOT Gateway).

## Configuration
```javascript
{
    module: 'MMM-Alexa',
    position: 'bottom_center'
    config: {
        host: 'apt****.iot.us-east-1.amazonaws.com',    // The endpoint for your device 
                                                        // (found in Registry -> Things -> "YourDevice" -> Interact)
        certPath: 'C:/_data/dev/certs', // See below
        certID: '16cc68c66f', // See below
        topics: [           // An array of topics that we want to subscribe to from the AWS IOT device
            {
                topic: 'MagicMirror:Play',  // The actual topic that is sent by the AWS IOT
                module: 'SonosPlay',        // The MMM-Alexa module that handles this
                config: {}                  // Any configuration necessary for the MMM-Alexa module
            }
        ]
    }
}
```
### Certificate paths and id
When creating a certificate for your device in the [AWS IOT console](https://console.aws.amazon.com/iotv2) you will get a set of files that you should save in a safe location. These are by default named 

* xxxxxxxx-certificate.pem.crt 
* xxxxxxxx-public.pem.key 
* xxxxxxxx-private.pem.key 

where xxxxxxxx is the beginning of the certificate id. When configuring this module set 
* certPath to the directory where you stored the files
* certID to the xxxxxxxx

the filenames are created like this `keyPath: self.config.certPath + "/" + self.config.certID + "-private.pem.key"`

You will also need the Root-CA and it is assumed to have the name `root-CA.crt`and be located in the same folder.

## Modules
Modules can be added to the configuration. The following is assumed about modules:
* The module is located in `../MMM-Alexa/modules/modulename/index.js`
* The module must implement the function `handleTopic(topic, payload)` and `init(config)`
* When loading a module MMM-Alexa will add a `helper` object to the module. This helper is the `node_helper` instance so it is possible for the module to use for instance `sendSocketNotification` function.

For an example have a look at the SonosPlay module.

### Sonos Play module
The Sonsos Play module assumes that there is a [node-sonos-http-api](https://github.com/jishi/node-sonos-http-api) instance running.

The module takes a message body with the following format
```json
{
    "action": "play",   // what to do; play, pause, stop, resume
    "what": "kalle",    // what to play
    "from": "spotify",  // from which source
    "where": "office"   // where to play it
}
```

