import { Scope, Hx } from "../vendors/helex";
import Sound from "../vendors/sound";

export default (): Hx => {
    return new Hx({
        "header": ["music", function (music: Sound) {
            let vm = this;
            vm.play = function (progressBar: number) {
                console.log(progressBar);
            }
            vm.togglePlay = function () {
                music.toggle();
            }
            // return new Scope(function (scope: any) {
            //     scope.play = function (progressBar: number) {
            //         console.log(progressBar);
            //     }
            //     scope.togglePlay = function () {

            //     }
            // });
        }]
    });
}