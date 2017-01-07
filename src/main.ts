import hxSetter from "./common/mHx";
import routeSetter from "./common/mRoute";
import Sound from "./vendors/sound"

let hx = hxSetter();

routeSetter(hx);
new Sound("assets/music/kotone.mp3", 100, true);