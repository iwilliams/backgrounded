# Backgrounded

Backgrounded is a plugin that helps you with HTML5 background videos, specifically background videos with large file sizes. Say you have a business requirement to add a very large background video to your website. You don't want to have the video buffering and stuttering and you don't want to add a super long preloader while everything comes down the wire. With Backgrounded you can have two versions of a video, one that is a smaller file size, and then the beefy full res high quality video. Backgrounded will load the low quality video first, and then swap in the high quality one when it is ready to go. Backgrounded will also take care of scaling the video to fit the height and width of its container div (like `background: cover` in css).

## Getting started

### Install
`npm install backgrounded`

### Include

#### As a ES6 module
```JavaScript
import Backgrounded from 'backgrounded';
```

#### As a CommonJs module
```JavaScript
const Backgrounded = require('backgrounded');
```
