import { inject, hx } from "./vendors/helex";
import include from "./common/include";
import routeSetter from "./common/mRoute";
import Sound from "./vendors/sound";

inject("music", new Sound({ src: "assets/music/いつも何度でも.mp3", volume: 0.8 }));
include();
routeSetter(hx);