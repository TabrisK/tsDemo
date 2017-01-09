import { State } from "./router"
import Util from "../vendors/util";

export { Scope, ScopeMap, Hx }

class Scope{
    private localScope:any;
    constructor(fn:(member:{[x:string]: any})=>void){
        this.localScope = {};
        fn(this.localScope);
    }
    public get(){
        return this.localScope;
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
                            directiveCompiler[attr.name](state.name, subElements[i], scope, attr);//compile
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
    "h-click": function(stateName: string, ele: Element, scope: Scope, expression: string){
        ele.addEventListener("click",function(e){
            hEval(stateName, scope, expression);//compile
        });
    }
}

function hEval(state:string, scope: Scope, exp: string){
    eval("var "+state+"= scope;");
    eval(exp);
}