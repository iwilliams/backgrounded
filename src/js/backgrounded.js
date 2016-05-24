export default class Backgrounded {

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
        let container   = this._container = videoContainer.nodeType ? videoContainer : document.querySelector(videoContainer);
        let videos      = this._videos    = videoSources;

        // Create canvas element
        let canvas = this._canvas = document.createElement('canvas');
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        container.appendChild(canvas);

        // Save ctx
        let ctx = this._ctx = canvas.getContext('2d');

        // Setup video elements
        let videoElements = this._videoElements = videos.map((sources, idx, arr) => {
            let videoElement = document.createElement('video');
            videoElement.setAttribute('preload', 'none');
            videoElement.setAttribute('loop',    'true');

            sources.forEach(source => {
                let sourceElement = document.createElement('source');
                sourceElement.setAttribute('src',  source.src);
                sourceElement.setAttribute('type', source.type);
                videoElement.appendChild(sourceElement);
            });

            if(idx === 0) {
                let loaded = false;
                let canPlayThrough = e => {
                    this._setActiveVideo(videoElement);
                    this._render();
                    videoElements[1].load();
                    videoElement.removeEventListener('canplaythrough', canPlayThrough);
                }
                videoElement.addEventListener('canplaythrough', canPlayThrough);
            } else {
                let canPlayThrough = e => {
                    this._setActiveVideo(videoElement);
                    videoElement.removeEventListener('canplaythrough', canPlayThrough);
                }
                videoElement.addEventListener('canplaythrough', canPlayThrough);
            }

            return videoElement;
        });

        window.addEventListener('resize', this._calculateSize.bind(this));

        videoElements[0].load();
    }




    /**
     * Set active video
     */
    _setActiveVideo(video) {
        function swap() {
            this._activeVideo = video;
            this._calculateSize();
            video.play();
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
    }




    get video() {
        return this._currentVideo;
    }




    /**
     * Pause the current video
     */
    pause() {
        if(!this._currentVideo.paused) this.currentVideo.pause();
    }




    /**
     * Play the current video
     */
    play() {
        if(this._currentVideo.paused) this.currentVideo.play();
    }


}
