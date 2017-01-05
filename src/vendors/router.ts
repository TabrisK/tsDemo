import * as _ from 'underscore';
//// <reference types="underscore"/>

interface State {
    node?: string;
    name: string;
    templateUrl: string;
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
    public getAllElementsWithAttribute(attribute: string, ele?: HTMLElement): HTMLElement[] {
        let matchingElements: Array<HTMLElement> = [];
        if (ele) {
            this.nodeWalking(ele, (n: HTMLElement) => {
                if (n.getAttribute(attribute) != null)
                    matchingElements.push(n);
            });

        } else {
            let allElements = document.getElementsByTagName('*');
            for (let i = 0, n = allElements.length; i < n; i++) {
                if (allElements[i].getAttribute(attribute) !== null) {
                    // Element exists with attribute. Add to array.
                    matchingElements.push(<HTMLElement>allElements[i]);
                }
            }
        }
        return matchingElements;
    }

    public nodeWalking(ele: Element, fn: Function): void {
        if (ele.children.length > 0) {
            for (let i = 0; i < ele.children.length; i++) {
                fn(ele.children[i]);
                this.nodeWalking(ele.children[i], fn);
            }
        }
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
    public getUrl = getUrl;
    public getCurrentState = getCurrentState;
}

let router: Router;
let util = new InnerUtil();
let currentState: State;
let fromState: State;
let hashRegx = new RegExp(/#\/([\/\w-]*)$/);

window.onload = () => {//first load
    var mp = hashRegx.exec(document.URL);
    if (mp) {
        setAllTemplate(mp[1]);
        setCurrentState(mp[1]);
    } else {
        setAllTemplate();
        setCurrentState();
    }
}

window.addEventListener("hashchange", (e) => {
    let oldp = hashRegx.exec(e.oldURL);
    let mp = hashRegx.exec(e.newURL);
    setfromState(oldp?oldp[1]:"");
    setCurrentState(mp?mp[1]:"");
    if (mp) {
        go(mp[1].replace("/", "."));
    }
    else {
        goDefault();
    }

    console.log(getfromState());
    console.log(getCurrentState());
}, false);

function getCurrentState() {
    return currentState;
}

function setCurrentState(url?: string) {
    if(!url)return currentState = router.default;
    let temporaryState = findStateByNode(url.replace("/", "."));
    if (temporaryState) {
        currentState = temporaryState;
    } else {
        currentState = router.default;
    }
}

function getfromState() {
    return fromState;
}

function setfromState(url?: string) {
    if(!url)return fromState = router.default;
    let temporaryState = findStateByNode(url.replace("/", "."));
    if (temporaryState) {
        fromState = temporaryState;
    } else {
        fromState = router.default;
    }
}

function goDefault() {
    go(router.default);
}

function go(node: string): void;
function go(state: State): void;
function go(x: any) {
    if (typeof x == "string") {

    } else {

    }
}

function getUrl(s: State | string): string {
    if (typeof s == "string")
        return s.replace(".", "/");
    else if (s.node) {
        return s.node.replace(".", "/");
    } else {
        console.error(s.name + " isn't a state.");
    }
}

function findStateByNode(node: string) {
    return _.find(router.state, { "node": node });
}

function getTemplateByUrl(state: State, cb: Function) {
    util.loadXMLDoc(state.templateUrl, "GET", (response: string) => {
        state.template = response;
        cb(response);
    });
}

/**
 * @param name: current hash value.For set default view in template
 */
function setAllTemplate(path?: string) {
    let states: State[];
    if (!!path) {//find target path states
        states = findStateByUrl(path);
    } else {//set default state
        states = findStateByUrl(getUrl(router.default));
    }
    compileAim(states, () => {//aim template finished

    });

    function compileAim(states: State[], fn: Function, aimEle?: HTMLElement): void {
        if (states.length > 0) {
            util.getAllElementsWithAttribute("template", aimEle).map((tEle) => {
                let templateVal = tEle.getAttribute("template");
                let tState: State;
                if (!!templateVal) {//normal template
                    if (templateVal.split("|").indexOf(states[0].name) >= 0) {//compile aim
                        aimEle = tEle;
                        tState = states[0];
                        insertTemplate(tEle, tState, () => {
                            compileAim(states.slice(1), fn, tEle);
                        });
                    } else {//compile other template
                        //templateVal must be a string without "|"
                        insertTemplate(tEle, findStateByName(templateVal), () => {
                            compileTemplate(tEle);
                        });
                    }
                } else {//target template who doesn't have  value
                    tState = states[states.length - 1];
                    insertTemplate(tEle, tState, () => {
                        compileTemplate(tEle);
                    });
                }
            });
        } else {
            fn();
        }
    }

    function insertTemplate(ele: HTMLElement, state: State, fn: Function) {
        if (state.template) {
            ele.innerHTML = state.template;
            fn();
        } else getTemplateByUrl(state, (t: string) => {//asynchronous
            ele.innerHTML = t;
            fn();
        });
    }

    function compileTemplate(ele?: HTMLElement) {//traverse compile who has compiled and inserted to its parent
        let tempList = util.getAllElementsWithAttribute("template", ele);
        if (tempList.length > 0) {//have template attr element
            for (let tEle of tempList) {
                let targetState = _.find(router.state, { name: tEle.getAttribute("template") });
                if (targetState)
                    insertTemplate(tEle, targetState, () => compileTemplate(tEle));
            }
        } else {

        }
    }
}

function findStateByName(name: string) {
    return _.find(router.state, { "name": name });
}

function findStateByUrl(path: string): State[] {
    let pl = path.split("/");
    let l: State[] = [];
    let currentNode = "";

    for (let sI = 0; sI < pl.length; sI++) {
        currentNode += pl[sI];
        for (let s of router.state) {
            if (s.node == currentNode) {
                l.push(s);
                break;
            }
        }
        currentNode += ".";
    }
    return l;
}

export { Route, Router, State }