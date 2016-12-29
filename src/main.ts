import { sayHello } from "./greet";
import { nationality } from "./greet";
import { spread } from "./greet";
import { typeProtectionDemo } from "./typeProtection";

function showHello(eltName: string, name:string){
    const elt = document.getElementById(eltName);
    elt.innerHTML = sayHello(name);
}

showHello("greeting", "TypeScript");
nationality("USA").result((rs:string) => document.getElementById("nation").innerHTML = rs);
spread(undefined, undefined, "Japan", "Britain", "Australia").result((rs: string) =>
    document.getElementById("spread").innerHTML = rs);
typeProtectionDemo();