import { hx } from "../vendors/helex";
import * as marked from "marked";

export default () => {
    hx.pushScope({
        "jsModuleBrief": [function () {
            let vm = this;
            vm.article = marked('# Marked in browser\n\nRendered by **marked**.');
        }]
    });
}