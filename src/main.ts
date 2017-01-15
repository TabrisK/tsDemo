import hxSetter from "./common/mHx";
import {inject} from "./vendors/helex";
import routeSetter from "./common/mRoute";
import Sound from "./vendors/sound";

inject("music", new Sound({src:"assets/music/いつも何度でも.mp3", volume: 0.8}));
let hx = hxSetter();
routeSetter(hx);