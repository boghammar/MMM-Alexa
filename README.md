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
        topics: [] // An array of topics that we want to subscribe to from the AWS IOT device
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
