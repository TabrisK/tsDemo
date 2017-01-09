import { State } from "./router"
import Util from "../vendors/util";

export { Scope, ScopeMap, Hx }

class Scope {
    private localScope:{[x:string]: number|string|Function};
    constructor(fn:(s:{[x:string]: number|string|Function})=>void){
        this.localScope = {};
        fn(this.localScope);
    }
    public eval(scopeName: string, expression: string){
        eval(expression);
    }
}

interface ScopeMap {
    [x: string]: Scope;
}

interface helex {
    compile(ele: HTMLElement, state: State): Scope;
}

let util = new Util();

class Hx implements helex {
    constructor(private scopes: ScopeMap) { }
    public compile(ele: Element, state: State): Scope {
        let subElements = (ele || document).children;
        let scope = this.scopes[state.name];
        if (subElements.length > 0) {
            for (let i = 0; i < subElements.length; i++) {//walking Element under ele
                for (let j = 0; j < subElements[i].attributes.length; j++) {//walking attr of the ele
                    let attr = subElements[i].attributes.item(j);
                    if (attr != null){
                        if(directiveCompiler[attr.name]){
                            directiveCompiler[attr.name](subElements[i], scope, attr);//compile
                        }
                    }
                }
                this.compile(subElements[i], state);
            }
        }

        return
    }
}

let directiveCompiler: {[key: string]: Function} = {
    "h-click": function(ele: Element, scope: Scope, expression: string){
        ele.addEventListener("click",function(e){
            console.log(scope);
        });
    }
}