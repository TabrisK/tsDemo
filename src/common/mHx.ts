import Hx from "../vendors/helex";
import { Scope } from "../vendors/helex";

export default (): Hx => {
    return new Hx({
        "header": {
            "play": function (progressBar: number) {
                console.log(progressBar);
            }
        }
    });
}