import { Route, Router, State } from "../vendors/router";


let routeSetter = (): void => {

    let states: State[] = [
        {
            name: "jsModuleBrief",
            templateUrl: "./template/jsModuleBrief.html"
        }
    ];

    let router: Router = {
        "state": states
    }

    let r = new Route(router);
}

export default function(){
    routeSetter();
};