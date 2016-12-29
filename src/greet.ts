export function sayHello(compiler: string){
    return `Hello from ${compiler}`;
}

//返回回调
export function nationality(nation = "China"){
    return {
        result: function(fn : any){fn(`I come from ${nation}`);}
    }
}

//...接收多余参数
export function spread(n1 = "USA", n2 = "China", ...restNation: string[]){
    let str = `${n1},${n2},${restNation}`;
    return {
        result: function(fn : any){fn(str)}
    }
}