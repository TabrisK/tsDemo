import { State } from "./router"
import Util from "../vendors/util";

export { Scope, Hx, inject }

class Scope {
    private localScope: any;
    // constructor(fn: (member: { [x: string]: any }) => void) {
    //     this.localScope = {};
    //     fn(this.localScope);
    //     return this;
    // }
    constructor() { return this; }
}

interface helex {
    compile(ele: HTMLElement, state: State): Scope;
}

let util = new Util();

class Hx implements helex {
    private scopes: { [x: string]: Scope };//a scope map;
    constructor(scopeInjector: { [x: string]: Array<any> }) {
        this.scopes = {};
        for (let scopeName in scopeInjector) {//walking scope
            let objs: Array<any> = [];
            scopeInjector[scopeName].forEach((item, key) => {//walking need injected object and inject them
                if (typeof item == "string") {
                    objs.push(module[item]);
                } else if (typeof item == "function") {
                    this.scopes[scopeName] = new Scope();
                    item.apply(this.scopes[scopeName], objs);
                }
            });
        }
    }
    public compile(ele: Element, state: State): Scope {
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
    "h-click": function (stateName: string, ele: Element, scope: Scope, expression: string) {
        ele.addEventListener("click", function (e) {
            (hEval)(stateName, scope, expression);//compile
        });
    }
}

function hEval(sn: string, scope: Scope, exp: string) {
    eval("var " + sn + "= scope;" + exp);
}