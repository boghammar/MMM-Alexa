# MMM-Alexa
A Magic Mirror module that interacts with Alexa and has a modularized pluginsystem to add various skills.

Inspired by joanaz [MMM-MirrorMirrorOnTheWall](https://github.com/joanaz/MMM-MirrorMirrorOnTheWall).

## Configuration
```javascript
{
    module: 'MMM-Alexa',
    position: 'bottom_center'
    config: {
        topics: [] // An array of topics that we want to subscribe to from the AWS IOT device
    }
}
```
