import * as _ from 'underscore';
import { Hx } from './helex';
import Util from "./util";


interface State {
    node?: string;
    name: string;
    templateUrl: string;
    template?: string;
    controller?: string;
}

interface Router {
    state: State[];
    default: State
}

interface Window {
    XMLHttpRequest: any;
}

class Route {
    constructor(r: Router, h: Hx) {
        router = r;
        hx = h;
    }
    public goDefault = goDefault;
    public go = go;
    public getUrl = getUrl;
    public getCurrentState = getCurrentState;
}

let router: Router;
let hx: Hx;
let util = new Util();
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
    setfromState(oldp ? oldp[1] : "");
    setCurrentState(mp ? mp[1] : "");
    if (mp && mp[1]) {
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
    if (!url) return currentState = router.default;
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
    if (!url) return fromState = router.default;
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
    var stateT: State;
    if (typeof x == "string") {
        stateT = findStateByNode(x) || getCurrentState();
    } else stateT = x;

    compileDifference(findStateByUrl(getfromState().node.replace(".", "/")),
        findStateByUrl(getCurrentState().node.replace(".", "/")));
    /**
     * @param get oldState and newState for compile
     */
    function compileDifference(oldSList: State[], newSList: State[], aimEle?: HTMLElement, changeFork?: boolean) {

        for (let tEle of util.getAllElementsWithAttribute("template", aimEle)) {
            let templateVal = tEle.getAttribute("template");
            let tState: State;
            if (changeFork == undefined || changeFork == null)
                changeFork = false;//don't change template without node in index.html
            if (!!templateVal) {//normal template
                if (templateVal.split("|").indexOf(newSList[0].name) >= 0) {//compile aim
                    aimEle = tEle;
                    tState = newSList[0];
                    if (oldSList[0] != newSList[0]) {//if different,insert template
                        insertTemplate(tEle, tState, () => {
                            compileDifference(oldSList.slice(1), newSList.slice(1), tEle, oldSList[0] != newSList[0]);
                        });
                    } else {// if having a same node here, compiling for searching difference with node
                        compileDifference(oldSList.slice(1), newSList.slice(1), tEle, oldSList[0] != newSList[0]);
                    }
                } else {
                    if (changeFork) {
                        //templateVal must be a string without "|"
                        insertTemplate(tEle, findStateByName(templateVal), () => {
                            compileTemplate(tEle);
                        });
                    }
                }//compile other template
            } else {//target template who doesn't have  value
                if (newSList.length == 1) {//the last branch
                    tState = newSList[0];
                    insertTemplate(tEle, tState, () => {
                        compileTemplate(tEle);
                    });
                }
            }
        }
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

function getParentState(state: State) {
    return findStateByNode(state.node.replace(/.?([\w-]*)$/, ""));
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
    compileAim(states, () => { });//aim template finished

    /**
     * @param states: a state list that from the top state to the branch one;
     */
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
                    if (states.length == 1) {//the last branch
                        tState = states[0];
                        insertTemplate(tEle, tState, () => {
                            compileTemplate(tEle);
                        });
                    }
                }
            });
        } else {
            fn();
        }
    }
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

function insertTemplate(ele: HTMLElement, state: State, fn: Function) {
    if (state.template) {
        ele.innerHTML = state.template;
        hx.compile(ele, state);
        fn();
    } else getTemplateByUrl(state, (t: string) => {//asynchronous
        ele.innerHTML = t;
        hx.compile(ele, state);
        fn();
    });
}

function findStateByName(name: string) {
    return _.find(router.state, { "name": name });
}

/**
 * @param path: URL
 * @returns a state list from the top state to the branch
 */
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