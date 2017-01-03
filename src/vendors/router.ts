import {_} from 'underscore';
//// <reference types="underscore"/>

interface State {
    name: string;
    templateUrl?: string;
    template?: string;
}

interface Router {
    state: State[];
    default: State
}
interface Window {
    XMLHttpRequest: any;
}

class InnerUtil {
    constructor() { }
    public getAllElementsWithAttribute(attribute: string): HTMLElement[] {
        let matchingElements: Array<HTMLElement> = [];
        let allElements = document.getElementsByTagName('*');
        for (let i = 0, n = allElements.length; i < n; i++) {
            if (allElements[i].getAttribute(attribute) !== null) {
                // Element exists with attribute. Add to array.
                matchingElements.push(<HTMLElement>allElements[i]);
            }
        }
        return matchingElements;
    }

    public loadXMLDoc = (url: string, method: string, cb: Function): void => {
        let xmlhttp: any;
        if (XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        }
        else {// code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                cb(xmlhttp.responseText);
            }
        }
        xmlhttp.open(method, url, true);
        xmlhttp.send();
    }
}

class Route {
    constructor(r: Router) {
        router = r;
    }
    public goDefault = goDefault;
    public go = go;
}

let router: Router;
let util = new InnerUtil();
let hashRegx = new RegExp(/#\/([\w-]*)$/);

window.onload = () => {
    if (!hashRegx.exec(document.URL))
        goDefault();
}

window.addEventListener("hashchange", (e) => {
    var stateName = hashRegx.exec(e.newURL)[1];
    console.log(stateName);
    if (stateName)
        router.state.map((state: State) => {
            var tarEle;
            if (state.name == stateName) {
                go(state);
            }
        });
}, false);

function goDefault() {

}

function go(state: State | string) {
    if(typeof state === "string")
        _.where(router.state, {name: state})

}

function getTemplateByUrl(url: string, cb: Function) {
    util.loadXMLDoc(state.templateUrl, "GET", (response: any) => {
        state.template = response;
        util.getAllElementsWithAttribute("template").map((ele) => ele.innerHTML = response);
    });
}

export { Route, Router, State }