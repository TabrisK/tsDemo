class Sound {
    private source:string;
    private volume:number;
    private loop: boolean;
    private son: HTMLElement;
    private finish: boolean;
    constructor(source: string, volume: number, loop: boolean) {
        this.source = source;
        this.volume = volume;
        this.loop = loop;
        let son;
        this.son = son;
        this.finish = false;
        this.play();
    }


    public play(): boolean {

        if (this.finish) return false;
        this.son = document.createElement("embed");
        this.son.setAttribute("src", this.source);
        this.son.setAttribute("hidden", "true");
        this.son.setAttribute("volume", this.volume + "");
        this.son.setAttribute("autostart", "true");
        this.son.setAttribute("loop", this.loop + "");
        document.body.appendChild(this.son);

    }
    public stop = function () {
        document.body.removeChild(this.son);
    }
    
    public remove = function () {
        document.body.removeChild(this.son);
        this.finish = true;
    }

    public init = function (volume: number, loop: boolean) {
        this.finish = false;
        this.volume = volume;
        this.loop = loop;
    }

}

export default Sound 