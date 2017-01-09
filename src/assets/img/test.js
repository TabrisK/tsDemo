function Scope(_name) {
    this.name = _name;
    this.greet = function (name) {
        console.log("Hello " + name + ".I am " + this.name);
    }
}


var header = new Scope("Hey");
(function (scopeName, scope, exp) {
    eval("var " + scopeName + "=scope");
    eval(exp);
})("header", header, "header.greet('Chang')");