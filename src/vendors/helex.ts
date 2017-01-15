import { State } from "./router"
import Util from "../vendors/util";

export { Hx, inject }

// class Scope {

//     constructor() { return this; }
// }

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
                    observe.call(this.scopes[scopeName]);
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
        let classObj = hEval(stateName, scope, "");//compile
        // for(let cls in classObj){
        //     observe(cls);
        // }
    }
}

function hEval(sn: string, scope: Object, exp: string) {
    let temp: any;
    eval("var " + sn + " = scope;" + exp);

}
function observe() {
    for (let key in this) {
        if (
            (this[key] && typeof this[key].paused == "boolean") ||
            key == "paused"
            // typeof this[key] == "object"
        ) {
            // if (Object.getOwnPropertyDescriptor(this, key) && Object.getOwnPropertyDescriptor(this, key).writable == false ||
            //     !Object.getOwnPropertyDescriptor(this, key))
            (function (scope: any, k: string) {
                console.log("property");
                let currentVal = scope[k];
                Object.defineProperty(scope, k, {//劫持数据
                    get: function () {
                        console.log("get");
                        return currentVal;
                    },
                    set: function (newVal) {
                        console.log("change");
                        currentVal = newVal;
                        this[k] = newVal;
                    }
                });
            })(this, key);
            observe.call(this[key]);
        }
    }

}