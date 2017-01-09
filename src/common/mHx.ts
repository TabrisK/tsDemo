import { Scope, Hx } from "../vendors/helex";

export default (): Hx => {
    return new Hx({
        "header": new Scope(function(scope:any){
            scope.play = function (progressBar: number) {
                console.log(progressBar);
            }
        })
    });
}