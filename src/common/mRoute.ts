import { Route, Router, State } from "../vendors/router";
//import { _ } from "underscore";


let routeSetter = (): void => {

    let states: State[] = [
        {
            name: "preface",
            templateUrl: "./common/preface.html"
        }, {
            name: "jsModuleBrief",
            templateUrl: "./jsModuleBrief/jsModuleBrief.html"
        }
    ];

    let router: Router = {
        "state": states,
        "default": states[0]
    }

    let r = new Route(router);
}

export default function () {
    routeSetter();
};