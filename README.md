# Backgrounded

Backgrounded is a plugin that helps you with HTML5 background videos, specifically background videos with large file sizes. Say you have a business requirement to add a very large background video to your website. You don't want to have the video buffering and stuttering and you don't want to add a super long preloader while everything comes down the tubes. With Backgrounded you can have two versions of a video, one that is a smaller file size, and then the beefy full res high quality video. Backgrounded will load the low quality video first, and then swap in the high quality one when it is ready to go. Backgrounded will also take care of scaling the video to fit the height and width of its container div (like `background: cover` in css).

## Getting started

### Install
`npm install backgrounded`

### Include

```JavaScript
import Backgrounded from 'backgrounded';
```
or
```JavaScript
const Backgrounded = require('backgrounded');
```

### Basic Use

```HTML
<div id="container"></div>

<script>
    let backgroundVideo = Backgrounded('#container', [
        [
            { src: '/low-quality.webm', type: 'video/webm' },
            { src: '/low-quality.mp4',  type: 'video/mp4'  },
            { src: '/low-quality.ogv',  type: 'video/ogg'  }
        ],
        [
            { src: '/high-quality.webm', type: 'video/webm' },
            { src: '/high-quality.mp4',  type: 'video/mp4'  },
            { src: '/high-quality.ogv',  type: 'video/ogg'  }
        ]
    ]);
</script>
```

## API

### `backgrounded = Backgrounded(container, videos)`
Returns an instance of Backgrounded.
- `container` A query selector or DOM node that the video will fill upon load.
- `videos`    An array of video elements or arrays that represent the source files for the video. The videos will load in priority of their index in the videos array, with the last element being the desired final full quality video.

### `.play()`
Will play the video background.

### `.pause()`
Will pause the video background.

## Properties

### `.activeVideo`
Read only getter that returns the active video element.

### `.videoElements`
Read only getter that returns the video elements.

### `.canvas`
Read only getter that returns the canvas element that the video plays in.

### `.container`
Read only getter that returns the container element.

## Events
Backgrounded will emit some events that can be subscribed to with `.on(eventName, listener)` or `.once(eventName, listener)` and detached with `.off(eventName, listener)`. Currently Backgrounded extends [Smelly Event Emitter](https://github.com/brandonjpierce/event-emitter) so you can visit their documentation if you need more power, but this could change in the future. However if I change the event emitter, `.on`, `.once`, and `.off` should not change.

### `.on('canplaythrough', (videoElement, index) => {})`
The `canplaythrough` event's listener will be called with the videoElement that `canplaythrough` as the first argument, and the `index` of that element in the initial videos array as it's second argument.

### `.on('setactivevideo', videoElement => {})`
The `setactivevideo` listener will be called with the video element that has been set as the current active video.

### `.on('resize', () => {})`
The `resize` listener will be called when the video has been resized to fill it's container.

### `.on('playing', videoElement => {})`
The `playing` listener will be called with the active video element when the video is played.

### `.on('paused', videoElement => {})`
The `paused` listener will be called with the active video element when the video is paused.

