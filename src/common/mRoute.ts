import { Route, Router, State } from "../vendors/router";
import { Hx } from "../vendors/helex";

let routeSetter = (hx: Hx): void => {
    let defaultState = {
        node: "main.preface",
        name: "preface",
        templateUrl: "./common/preface.html"
    };

    let states: State[] = [
        {
            node: "main",
            name: "main",
            templateUrl: "./common/main.html"
        }, {
            name: "header",
            templateUrl: "./common/header/header.html",
            controller: "./common/header/header.js"
        }, {
            name: "leftside",
            templateUrl: "./common/leftside.html"
        }, defaultState, {
            node: "profile",
            name: "profile",
            templateUrl: "./profile/profile.html"
        }, {
            node: "main.jsModuleBrief",
            name: "jsModuleBrief",
            templateUrl: "./jsModuleBrief/jsModuleBrief.html"
        }, {
            node: "main.about",
            name: "about",
            templateUrl: "./about/about.html"
        }
    ];

    let router: Router = {
        "state": states,
        "default": defaultState
    }
    let r = new Route(router, hx);
}

export default function (hx: Hx) {
    routeSetter(hx);
};