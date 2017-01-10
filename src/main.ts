import hxSetter from "./common/mHx";
import {inject} from "./vendors/helex";
import routeSetter from "./common/mRoute";
import Sound from "./vendors/sound";

inject("music", new Sound("assets/music/kotone.mp3", 100, true));
let hx = hxSetter();
routeSetter(hx);