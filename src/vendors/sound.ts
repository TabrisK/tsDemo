interface videoOptions {
    src: string;
    volume: number
}
class Sound {
    private ele: HTMLMediaElement;
    constructor(opts: videoOptions) {
        this.ele = document.createElement("video");
        this.ele.autoplay = true;
        this.ele.src = opts.src;
        this.ele.volume = opts.volume || 0.8;
        this.play();
    }
    public play() {
        this.ele.play();
    }
    public pause = function () {
        this.ele.pause();
    }
    public remove = function () {
    }
    public toggle = function () {
        if (this.ele.paused)
            this.ele.play();
        else
            this.ele.pause();

    }

}

export default Sound 