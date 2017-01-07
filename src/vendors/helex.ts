import { State } from "./router"
import Util from "../vendors/util";

export default Hx
export { Scope, ScopeMap }

interface Scope {
    [x: string]: Function | string | number;
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
    public compile(ele: HTMLElement, state: State): Scope {
        let subElements = (ele || document).children;
        let scope = { [state.name]: {} }
        if (subElements.length > 0) {
            for (let i = 0; i < subElements.length; i++) {//walking Element under ele
                for (let j = 0; j < subElements[i].attributes.length; j++) {
                    let attr = subElements[i].attributes.item(j);
                    if (attr != null){
                        if(directiveCompiler[attr.name]){
                            directiveCompiler[attr.name](scope);//compile
                        }
                    }
                }
            }
        }

        return
    }
}

let directiveCompiler: {[key: string]: Function} = {
    "h-click": function(scope: Scope){
    }
}