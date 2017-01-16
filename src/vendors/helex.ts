import * as _ from 'underscore';
import { State } from "./router"
import Util from "../vendors/util";

export { Hx, inject }

namespace regUtil {
    let objValGetter = new RegExp(/\s*:\s*([\w\+\-\*\/\=\%\!]*)\s*/g);
    let objKeyGetter = new RegExp(/['"]?([\w\s]*)['"]?:/g);
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
    private scopes: { [x: string]: Object };//a scope map;
    constructor(scopeInjector: { [x: string]: Array<any> }) {
        this.scopes = {};
        for (let scopeName in scopeInjector) {//walking scope
            let objs: Array<any> = [];
            scopeInjector[scopeName].forEach((item, key) => {//walking need injected object and inject them
                if (typeof item == "string") {
                    objs.push(module[item]);
                } else if (typeof item == "function") {
                    this.scopes[scopeName] = new Object();
                    item.apply(this.scopes[scopeName], objs);
                    //observe(this.scopes[scopeName])//data hijack
                    observe.call(this.scopes[scopeName], scopeName);
                }
            });
        }
    }
    public compile(ele: Element, state: State): Object {
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

        return
    }
}

let module: any = {};//module map
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
        let classObj: any = hEval(stateName, scope, expression);//compile
        parseClass();
        getRelevant(scope, regUtil.parseObjStr(expression).map((objBrief: regUtil.ObjBrief) => objBrief.val));
        listen(stateName, );

        function parseClass() {
            for (let c in classObj) {
                if (classObj[c]) {// need to add class
                    if (!ele.className.match(c))//doesn't have this class
                        ele.className += " " + c;
                } else //need to remove the class
                    ele.className.replace(c, "");
            }
        }

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
            // (this[key] && typeof this[key].paused == "boolean") ||
            // key == "paused"
            typeof this[key] != "function"
        ) {
            (function (scope: any, k: string) {
                console.log("property");
                let currentVal = scope[k];
                Object.defineProperty(scope, k, {//劫持数据
                    get: function () {
                        console.log("get");
                        broadcast("get", scopeName, parentKey + key, currentVal);
                        return currentVal;
                    },
                    set: function (newVal) {
                        console.log("change");
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

function getRelevant(scope: any, strElement: string[]): string[] {//递归寻找匹配项。header.c.b.a  定位到branch末节
    let l: string[] = [];
    for (let i in strElement) {
        for (let member in scope) {
            if (!!strElement[i].match(member))
                if (l.indexOf(member) < 0)
                    l.push(member)
        }

    }
    return l
}

function broadcast(operation: string, scope: string, key: string, val: any) {

}

// function on(scope, callback: function) {

// }