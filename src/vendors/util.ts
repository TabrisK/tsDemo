export default class util {
    constructor() { }
    public getAllElementsWithAttribute(attribute: string, ele?: HTMLElement): HTMLElement[] {
        let matchingElements: Array<HTMLElement> = [];
        if (ele) {
            this.nodeWalking(ele, (n: HTMLElement) => {
                if (n.getAttribute(attribute) != null)
                    matchingElements.push(n);
            });

        } else {
            let allElements = document.getElementsByTagName('*');
            for (let i = 0, n = allElements.length; i < n; i++) {
                if (allElements[i].getAttribute(attribute) !== null) {
                    // Element exists with attribute. Add to array.
                    matchingElements.push(<HTMLElement>allElements[i]);
                }
            }
        }
        return matchingElements;
    }

    public nodeWalking(ele: Element, fn: Function): void {
        if (ele.children.length > 0) {
            for (let i = 0; i < ele.children.length; i++) {
                fn(ele.children[i]);
                this.nodeWalking(ele.children[i], fn);
            }
        }
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