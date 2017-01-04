import * as _ from 'underscore';
//// <reference types="underscore"/>

interface State {
    node?: string;
    url?: string;
    view?: State[];
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

window.onload = () => {//first load
    var stateName = hashRegx.exec(document.URL);
    stateName ? setAllTemplate(stateName[1]) : setAllTemplate();
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
            setTemplate(targetState, targetState.template);
        else
            getTemplateByUrl(targetState, (t: string) => setTemplate(targetState, t));

    } else {
        if (state.template)
            setTemplate(state, state.template);
        else
            getTemplateByUrl(state, (t: string) => setTemplate(state, t));
    }

}

function getTemplateByUrl(state: State, cb: Function) {
    util.loadXMLDoc(state.templateUrl, "GET", (response: string) => {
        state.template = response;
        cb(response);
    });
}

function setTemplate(state: State, t: string) {
    util.getAllElementsWithAttribute("template").map((ele) => {
        if (!ele.getAttribute("template"))
            ele.innerHTML = t;
    });
}



/**
 * @param name: current hash value.For set default view in template
 */
function setAllTemplate(name?: string) {
    //traverse the dom for get element whit template
    let fillList = util.getAllElementsWithAttribute("template").map((ele) => {
        //search a state who match this template name
        let attr = ele.getAttribute("template");
        if (attr) {//template have explicitly target
            for (let s of router.state) {
                if (s.name == attr) {
                    if (s.template)
                        ele.innerHTML = s.template;
                    else
                        getTemplateByUrl(s, (t: string) => ele.innerHTML = t);
                }
            }
        } else {//template for default state
            //set target state if haveing name,or set default state
            let s = !!name ? _.find(router.state, { "name": name }) || router.default : router.default;
            if (s.template)
                ele.innerHTML = s.template;
            else
                getTemplateByUrl(s, (t: string) => ele.innerHTML = t);

        }
    });
}

export { Route, Router, State }