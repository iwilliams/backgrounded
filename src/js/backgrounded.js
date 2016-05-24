import EventEmitter from 'smelly-event-emitter';

export default class Backgrounded extends EventEmitter {

    /**
     * sources:
     * [
     *      // Sources to load first
     *      [
     *          { src: '....', type: '....' },
     *          { src: '....', type: '....' },
     *          { src: '....', type: '....' },
     *      ],
     *      // Sources to load second
     *      [
     *          { src: '....', type: '....' },
     *          { src: '....', type: '....' },
     *          { src: '....', type: '....' },
     *      ],
     *      // Add as many as you want?
     *      [
     *          ....
     *      ]
     * ]
     *
     **/
    constructor(videoContainer, videoSources) {
        super();

        let container      = this._container = videoContainer.nodeType ? videoContainer : document.querySelector(videoContainer);
        if(!container) throw "Provided container is invalid";

        this._videoSources = videoSources;
        if(videoSources === undefined || videoSources.length < 1) throw "At least one video must be supplied";

        // Instantiate some vars
        this._isPlaying = false;

        // Create canvas element
        let canvas = this._canvas = document.createElement('canvas');
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        container.appendChild(canvas);

        // Save ctx
        let ctx = this._ctx = canvas.getContext('2d');

        // Setup video elements
        let videoElements = this._videoElements = videoSources.map((sources, idx, arr) => {
            let videoElement;

            // If a video element was passed in then just use that
            if(sources.nodeType && sources.nodeName === "VIDEO") {
                videoElement = sources;
            // Otherwise build a video element and set its sources
            } else {
                videoElement = document.createElement('video');
                videoElement.setAttribute('preload', 'none');
                videoElement.setAttribute('loop',    'true');

                sources.forEach(source => {
                    let sourceElement = document.createElement('source');
                    sourceElement.setAttribute('src',  source.src);
                    sourceElement.setAttribute('type', source.type);
                    videoElement.appendChild(sourceElement);
                });
            }

            // Can Play Through callback for videos that load
            let canPlayThrough = e => {
                this._setActiveVideo(videoElement);
                // If there is another video to load then start it up
                if(videoElements[idx + 1]) videoElements[idx + 1].load();
                // Emit event for canplaythrough
                this.emit('canplaythrough', videoElement, idx);
                // This only needs to happen once so remove the event listener
                videoElement.removeEventListener('canplaythrough', canPlayThrough);
            }

            // If the video element is not fully loaded then attach a loading event
            if(videoElement.readyState !== HTMLMediaElement.HAVE_ENOUGH_DATA) {
                videoElement.addEventListener('canplaythrough', canPlayThrough);
            // Else fire the function manually
            } else {
                canPlayThrough();
            }

            return videoElement;
        });

        // Attach resize event so the canvas will be the right size
        window.addEventListener('resize', this._calculateSize.bind(this));

        // Kick off the load for the first video
        videoElements[0].load();
    }




    /**
     * Set active video
     */
    _setActiveVideo(video) {
        function swap() {
            this._activeVideo = video;
            this._calculateSize();
            this.play();
            this.emit('setactivevideo', video);
        }

        if(!this._activeVideo) {
            swap.call(this);
        } else {
            this._activeVideo.addEventListener('seeked', e => {
                this._activeVideo.pause();
                swap.call(this);
            });
        }
    }




    /**
     * Loop draw function
     */
    _render() {
        this._draw();
        this._animationKey = window.requestAnimationFrame(this._render.bind(this));
    }




    /**
     * Draw current video to canvas
     */
    _draw() {
        this._ctx.drawImage(this._activeVideo, this._videoX, this._videoY, this._videoWidth, this._videoHeight);
    }




    /**
     * Calculate and size the video/canvas
     */
    _calculateSize() {
        this._canvas.width  = this._container.clientWidth;
        this._canvas.height = this._container.clientHeight;

        let videoW  = this._activeVideo.videoWidth
          , videoH  = this._activeVideo.videoHeight
          , minW    = this._canvas.width
          , minH    = this._canvas.height

        // Intrinsic ratio
        // Will be more than 1 if W > H and less if H > W
        var videoRatio = (videoW / videoH).toFixed(2);

        var widthRatio = minW / videoW;
        var heightRatio = minH / videoH;

        // Whichever ratio is more, the scaling
        // has to be done over that dimension
        if (widthRatio > heightRatio) {
            this._videoWidth  = minW;
            this._videoHeight = Math.ceil( this._videoWidth / videoRatio );
        }
        else {
            this._videoHeight = minH;
            this._videoWidth  = Math.ceil( this._videoHeight * videoRatio );
        }

        this._videoX = (minW - this._videoWidth)/2;
        this._videoY = (minH - this._videoHeight)/2;

        this.emit('resize');
    }




    /**
     * Returns the current video
     */
    get activeVideo() {
        return this._activeVideo;
    }




    /**
     * Returns initialized video elements
     */
    get videoElements() {
        return this._videoElements;
    }




    /**
     * Returns the canvas
     */
    get canvas() {
        return this._canvas;
    }




    /**
     * Returns the container
     */
    get container() {
        return this._container;
    }




    /**
     * Pause the current video
     */
    pause() {
        if(!this._activeVideo.paused) {
            this.activeVideo.pause();
            window.cancelAnimationFrame(this._animationKey);
            this._animationKey = null;
            this.emit('paused', this._activeVideo);
            this._isPlaying = false;
        }
    }




    /**
     * Play the current video
     */
    play() {
        if(this._activeVideo.paused) {
            this._activeVideo.play();
            if(!this._animationKey) this._render();
            this.emit('playing', this._activeVideo);
            this._isPlaying = true;
        }
    }


}
