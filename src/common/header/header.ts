import { hx } from "../../vendors/helex";
import Sound from "../../vendors/sound";

export default () => {
    hx.pushScope({
        "header": ["music", function (music: Sound) {
            let vm = this;
            vm.playing = true;
            vm.play = function (progressBar: number) {
                console.log(progressBar);
            }
            vm.togglePlay = function () {
                vm.playing = music.toggle();
            }
        }]
    });
}