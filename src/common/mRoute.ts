import { Route, Router, State } from "../vendors/router";

let routeSetter = (): void => {
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
        },
        {
            name: "header",
            templateUrl: "./common/header.html"
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
        }
    ];

    let router: Router = {
        "state": states,
        "default": defaultState
    }

    let r = new Route(router);
}

export default function () {
    routeSetter();
};