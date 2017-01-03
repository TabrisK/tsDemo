import * as _ from 'underscore';
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
    var stateName = hashRegx.exec(document.URL);
    if (!stateName)
        goDefault();
    else
        go(stateName[1]);
}

window.addEventListener("hashchange", (e) => {
    var stateName = hashRegx.exec(e.newURL)[1];
    console.log(stateName);
    if (stateName)
        router.state.map((state: State) => {
            if (state.name == stateName) {
                go(state);
            }
        });
}, false);

function goDefault() {
    go(router.default);
}

function go(state: State | string) {
    console.log(typeof state);
    if (typeof state === "string") {
        let targetState = _.find(router.state, { name: state });
        if (targetState.template)
            setTemplate(targetState.template);
        else
            getTemplateByUrl(targetState, (t: string) => setTemplate(t));

    } else {
        if (state.template)
            setTemplate(state.template);
        else
            getTemplateByUrl(state, (t: string) => setTemplate(t));
    }

}

function getTemplateByUrl(state: State, cb: Function) {
    util.loadXMLDoc(state.templateUrl, "GET", (response: any) => {
        state.template = response;
        cb(response);
    });
}

function setTemplate(t: string) {
    util.getAllElementsWithAttribute("template").map((ele) => ele.innerHTML = t);
}

export { Route, Router, State }