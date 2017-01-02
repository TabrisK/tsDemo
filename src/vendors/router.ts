interface State {
    name: string;
    templateUrl: string;
}

interface Router {
    state: State[];
}
interface Window {
    XMLHttpRequest: any;
}

class InnerUtil {
    constructor() { }
    public getAllElementsWithAttribute(attribute: string): HTMLElement[] {
        let matchingElements: Array<HTMLElement> = [];
        let allElements = document.getElementsByTagName('*');
        for (let i = 0, n = allElements.length; i < n; i++) {
            if (allElements[i].getAttribute(attribute) !== null) {
                // Element exists with attribute. Add to array.
                matchingElements.push(<HTMLElement>allElements[i]);
            }
        }
        return matchingElements;
    }

    public loadXMLDoc = (url: string, method: string, cb: Function): void => {
        let xmlhttp: any;
        if (XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        }
        else {// code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                cb(xmlhttp.responseText);
            }
        }
        xmlhttp.open(method, url, true);
        xmlhttp.send();
    }
}

class Route {
    constructor(r: Router) {
        router = r;
    }
}

let router: Router;
let util = new InnerUtil();


window.addEventListener("hashchange", (e) => {
    var stateName = /#\/([\w-]*)$/.exec(e.newURL)[1];
    console.log(stateName);
    if (stateName)
        router.state.map((state: State) => {
            var tarEle;
            if (state.name == stateName) {
                util.loadXMLDoc(state.templateUrl, "GET", (response: any) => {
                    util.getAllElementsWithAttribute("template").map((ele)=>ele.innerHTML = response);
                });
            }
        });
}, false);

export { Route, Router, State }