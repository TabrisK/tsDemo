import { Route, Router, State } from "../vendors/router";

let routeSetter = (): void => {
    let defaultState = {
        name: "preface",
        templateUrl: "./common/preface.html"
    };

    let states: State[] = [
        {
            name: "preface",
            templateUrl: "./common/preface.html"
        }, {
            name: "header",
            templateUrl: "./common/header.html"
        }, defaultState, {
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