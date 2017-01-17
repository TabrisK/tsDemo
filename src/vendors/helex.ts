import * as _ from 'underscore';
import { State } from "./router"
import Util from "../vendors/util";

namespace regUtil {
    let objValGetter = new RegExp(/\s*:\s*([\w\+\-\*\/\=\%\!\.]*)\s*/g);
    let objKeyGetter = new RegExp(/['"]?([\w\s\.]*)['"]?:/g);
    export function parseObjStr(str: string): Array<ObjBrief> {
        let l = [{
            key: objKeyGetter.exec(str),
            val: objValGetter.exec(str)
        }];
        while (l[l.length - 1].key !== null && l[l.length - 1].val !== null) {
            l.push({
                key: objKeyGetter.exec(str),
                val: objValGetter.exec(str)
            });
        }
        return _.compact(l.map((objEle) => {
            if (objEle.key !== null && objEle.val !== null)
                return {
                    key: objEle.key[1],
                    val: objEle.val[1]
                }
        }));
    }
    export interface ObjBrief {
        key: string,
        val: string
    }
}

interface helex {
    compile(ele: HTMLElement, state: State): void;
}

let util = new Util();

class Hx implements helex {
    constructor(private scopes: { [x: string]: Object } = {}) {
    }
    public compile(ele: Element, state: State): void {
        let subElements = (ele || document).children;
        let scope = this.scopes[state.name];
        if (subElements.length > 0) {
            for (let i = 0; i < subElements.length; i++) {//walking Element under ele
                for (let j = 0; j < subElements[i].attributes.length; j++) {//walking attr of the ele
                    let attr = subElements[i].attributes.item(j);
                    if (attr != null) {
                        if (directiveCompiler[attr.nodeName]) {
                            directiveCompiler[attr.nodeName](state.name, subElements[i], scope, attr.nodeValue);//compile
                        }
                    }
                }
                this.compile(subElements[i], state);
            }
        }
    }
    public pushScope(scopeInjector: { [x: string]: Array<any> }) {
        for (let scopeName in scopeInjector) {//walking scope
            let objs: Array<any> = [];
            scopeInjector[scopeName].forEach((item, key) => {//walking need injected object and inject them
                if (typeof item == "string") {
                    objs.push(module[item]);
                } else if (typeof item == "function") {
                    this.scopes[scopeName] = new Object();
                    item.apply(this.scopes[scopeName], objs);
                    observe.call(this.scopes[scopeName], scopeName);
                }
            });
        }
    };
}

class Listener {
    constructor(private listen: { set: any, get: any } = { set: {}, get: {} }) { }
    public set = function (event: string, name: string, cb: Function) {
        this.listen[event][name] = cb;
    }
    public get = function (event: string, name: string): Function {
        return this.listen[event][name];
    }
}

let module: any = {};//module map
let listener = new Listener();
let hx = new Hx();
function inject(_moudleName: string, _module: any) {
    module[_moudleName] = _module;
}

let directiveCompiler: { [key: string]: Function } = {
    "h-click": function (stateName: string, ele: Element, scope: Object, expression: string) {
        ele.addEventListener("click", function (e) {
            hEval(stateName, scope, expression);//compile
        });
    },
    "h-class": function (stateName: string, ele: Element, scope: Object, expression: string) {
        parseClass(hEval(stateName, scope, expression));
        listener.set("set", stateName, () => {
            parseClass(hEval(stateName, scope, expression));
        });

        function parseClass(classObj: any) {
            for (let c in classObj) {
                if (classObj[c]) {// need to add class
                    if (!ele.className.match(c))//doesn't have this class
                        ele.className += " " + c;
                } else //need to remove the class
                    ele.className = ele.className.replace(new RegExp("\\s*" + c, "g"), "");
            }
        }

    },
    "h-bind": function (stateName: string, ele: Element, scope: Object, expression: string) {
        ele.innerHTML = hEval(stateName, scope, expression);
    }
}

function hEval(sn: string, scope: Object, exp: string): any {
    let temp: any;
    eval("var " + sn + " = scope;temp=" + exp);
    return temp;
}

function observe(scopeName: string, parentKey = "") {
    for (let key in this) {
        if (
            typeof this[key] != "function"
        ) {
            (function (scope: any, k: string) {
                // console.log("property");
                let currentVal = scope[k];
                Object.defineProperty(scope, k, {//劫持数据
                    get: function () {
                        // console.log("get");
                        broadcast("get", scopeName, parentKey + key, currentVal);
                        return currentVal;
                    },
                    set: function (newVal) {
                        // console.log("change");
                        currentVal = newVal;
                        broadcast("set", scopeName, parentKey + key, currentVal);
                    }
                });
            })(this, key);
            if (typeof this[key] == "object")
                observe.call(this[key], scopeName, key);
        }
    }
}

function broadcast(operation: string, scopeName: string, key: string, val: any) {
    let cb = listener.get(operation, scopeName);
    cb && cb();
}

export { inject, Hx, hx }