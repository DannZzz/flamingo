
function scrollChatTo(messageId = null) {
    if (!messageId) {
        const messages = document.getElementsByClassName("chat-message");
        messages[messages.length - 1].scrollIntoView()
    } else {
        const message = elementById(messageId);
        message?.scrollIntoView();
    }
}

/**
 * Returns an element with specified id 
 * 
 * @param {string} id element's id
 * @returns 
 */
function elementById(id) {
    return document.getElementById(id);
}
/**
 * Returns array of elements with specified class
 * 
 * @param {string} _class element's class
 * @returns 
 */
function elementsByClass(_class) {
    return [...document.getElementsByClassName(_class)];
}

/**
 * Add/Remove element's "hide" class 
 * 
 * @param {Element} element Html element
 * @param {boolean} show true - remove, false - add 
 */
function hide (element, show = false) {
    element.classList[show ? "remove" : "add"]("hide");
}

/**
 * Remove element's all childs
 * 
 * @param {Element | HTMLElement} parent Html element
 */
function removeChildren (parent)  {
    while (parent.lastChild) {
        parent.removeChild(parent.lastChild);
    }
};

/**
 * @param {number | string} code number of style fail# 
 * @param {*} timeout 
 */
function invalidCode (code, timeout = 5000) {
    $(".notify").addClass("active");
    $("#notifyType").addClass("fail"+code);
        
    setTimeout(function(){
        $(".notify").removeClass("active");
        $("#notifyType").removeClass("fail"+code);
    },timeout);
}

/**
 * Get's all uploaded and not hidden images
 * @param {boolean} images
 * @returns {Element[] | HTMLImageElement[]}
 */
function getPendingImages (images = false) {
    const children = elementById("column").children;
    var ready = [];
    for (let i = 0; i < children.length; i++) {
        if (!children[i].classList.contains('hide')) ready.push(children[i]);
    };
    if (!images) return ready;
    return ready.map(element => {
        for (let i = 0; i < element.children.length; i++) {
            if (element.children[i].classList.contains("pendingImage")) return dataURLtoFile(element.children[i].src, randomBigName()+".png")
        } 
    })
}

/**
 * Creates div element
 * 
 * @param {string | HTMLElement | HTMLElement[]} inner inner of element 
 * @param {{id?: string, class?: string[], onclick?: (e?: MouseEvent) => void}} options new div's options
 * @returns {HTMLDivElement}
 */
function newDiv(inner = "", options = {}) {
    const el = document.createElement("div");
    if (inner) {
        if (typeof inner === "string") {
            el.innerHTML = inner
        } else {
            if (Array.isArray(inner)) {
                el.append(...inner);
            } else el.append(inner);
        }
    };
    if (options?.id) el.id = options.id;
    if (options?.class?.length > 0) options.class.forEach(c => el.classList.add(c));
    if (options?.onclick) el.onclick = options.onclick;
    return el;
}

/**
 * Creates a element
 * 
 * @param {string | HTMLElement | HTMLElement[]} inner inner of element
 * @param {{id?: string, class?: string[], href?: string, onclick?: (e?: MouseEvent) => void}} options new a's options
 * @returns {HTMLAnchorElement}
*/
function newA (inner = "", options = {}) {
    const el = document.createElement("a");
    if (inner) {
        if (typeof inner === "string") {
            el.innerHTML = inner
        } else {
            if (Array.isArray(inner)) {
                el.append(...inner);
            } else el.append(inner);
        }
    };
    if (options?.id) el.id = options.id;
    if (options?.class?.length > 0) options.class.forEach(c => el.classList.add(c));
    if (options?.onclick) el.onclick = options.onclick;
    if (options?.href) el.href = options.href;
    return el;
}

/**
 * Creates p element
 * 
 * @param {string | HTMLElement | HTMLElement[]} inner inner of element
 * @param {{id?: string, class?: string[], onclick?: (e?: MouseEvent) => void}} options new a's options
 * @returns {HTMLParagraphElement}
*/
function newP (inner = "", options = {}) {
    const el = document.createElement("p");
    if (inner) {
        if (typeof inner === "string") {
            el.innerHTML = inner
        } else {
            if (Array.isArray(inner)) {
                el.append(...inner);
            } else el.append(inner);
        }
    };
    if (options?.id) el.id = options.id;
    if (options?.class?.length > 0) options.class.forEach(c => el.classList.add(c));
    if (options?.onclick) el.onclick = options.onclick;
    return el;
}

/**
 * Creates h element
 * 
 * @param {string | HTMLElement | HTMLElement[]} inner inner of element
 * @param {{size?: 1 | 2 | 3 | 4 | 5 | 6, id?: string, class?: string[], onclick?: (e?: MouseEvent) => void}} options new a's options
 * @returns {HTMLHeadingElement}
*/
function newH (inner = "", options = {}) {
    const el = document.createElement("h"+(options.size || 1));
    if (inner) {
        if (typeof inner === "string") {
            el.innerHTML = inner
        } else {
            if (Array.isArray(inner)) {
                el.append(...inner);
            } else el.append(inner);
        }
    };
    if (options?.id) el.id = options.id;
    if (options?.class?.length > 0) options.class.forEach(c => el.classList.add(c));
    if (options?.onclick) el.onclick = options.onclick;
    return el;
}

/**
 * Creates img element
 * 
 * @param {string | HTMLElement | HTMLElement[]} inner inner of element
 * @param {{width?: number, height?: number, id?: string, class?: string[], src?: string, onclick?: (e?: MouseEvent) => void}} options new img's options
 * @returns {HTMLImageElement}
*/
function newImg (inner = "", options = {}) {
    const el = document.createElement("img");
    if (inner) {
        if (typeof inner === "string") {
            el.innerHTML = inner
        } else {
            if (Array.isArray(inner)) {
                el.append(...inner);
            } else el.append(inner);
        }
    };
    if (options?.width) el.width = options.width; 
    if (options?.height) el.height = options.height; 
    if (options?.id) el.id = options.id;
    if (options?.class?.length > 0) options.class.forEach(c => el.classList.add(c));
    if (options?.onclick) el.onclick = options.onclick;
    if (options?.src) el.src = options.src;
    return el;
}


/**
 * 
 * @param {*} dataurl 
 * @param {*} filename 
 * @returns 
 */
function dataURLtoFile(dataurl, filename) {
 
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), 
        n = bstr.length, 
        u8arr = new Uint8Array(n);
        
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    
    return new File([u8arr], filename, {type:mime});
}

function randomBigName () {
    var code = '';
    var symbols = "abcdefghijklmnopqrstuvwxyz"
    for (let i = 0; i < 100; i++) {
        const symb = symbols[Math.floor(Math.random() * symbols.length)];
        code += i % 2 === 0 ? symb.toUpperCase() : symb
    } 
    return code;
}

/**
 * Decodes %aplg 
 */
function decodeHtml(text) {
    return text.replaceAll("&lt", "<").replaceAll("&gt", ">").replaceAll("&quot", "\"").replaceAll("&apos", "'");
}


/**
 * 
 * @param {HTMLElement} element 
 * @param {string} classname 
 * @param {string} subClass
 * @returns {HTMLElement[]}
 */
function elementsInElement (element, classname, subClass) {
    const arr = [];
    console.log(subClass)
    const el = element.children.namedItem(subClass).children;
    for (let i = 0; i < el.length; i++) {
        if (el[i].classList.contains(classname)) arr.push(el[i]);
    }
    return arr;
}