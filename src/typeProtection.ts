/**
 * Created by Administrator on 2016/12/28.
 */

function paddingLeft(val:string, pad: number | string):string {
    if (typeof pad === "string")
        return pad + val;
    else if (typeof pad === "number") {
        return Array(pad + 1).join(" ") + val;
    }
    throw new Error(`Expected string or number, got '${val}'.`);
}

export function typeProtectionDemo() {
    console.log(paddingLeft("Hello World!", "TS,"));
    console.log(paddingLeft("Hello World!", 5));
}


