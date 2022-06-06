const overlay = () => document.getElementById("overlay");
const overlayContent = () => document.getElementById("overlay-content");

document.onclick = hideMenu;



/**
 * 
 * @param {PointerEvent} e 
 */
function hideMenu(e, justHide = false) {
    if (overlay().classList.contains("hide") && e) {
        parseProfileParamEvent(e);

        checkEmojiPicker(e)
    };

    
    
    if (e && e?.target?.classList?.contains("messageData")) return;

    // document.getElementById("contextMenu").classList.add("hide");
    if (justHide === true || (e && (e?.target?.id === "overlay" || e?.target?.classList.contains("messageDataItem") || e.target.closest(".messageDataItem")))) {
        overlayContent().innerHTML = ""
        hide(overlay())
    }
    

    // document.getElementById("contextMenu").innerHTML = "";

}

function contextMenu(id) {
    // if (document.getElementById("contextMenu")
    //     .style.display == "block")
    if (!overlay().classList.contains("hide"))
        hideMenu();
    else {
        
        
        
        socket.emit("messageDataRequest", {messageId: id, token: tok()});

        socket.on("contextMenuHtml", ({clone, ctx: ctxHtml}) => {
            // var menu = document.getElementById("contextMenu");
            // menu.innerHTML = html;
            // menu.classList.remove("hide")
            
            const ctx = document.createElement("div");
            ctx.innerHTML = ctxHtml;
            ctx.classList.add("ctx");

            overlayContent().innerHTML = ctx.outerHTML + clone;
            hide(overlay(), true);

            document.onkeydown = (k) => {
                if (!overlay().classList.contains("hide")) {
                    if (k.key === "Delete") {
                        socket.emit("messageDeleteRequest", {token: tok(), messageId: id})
                    }
                }
            }
        })
    }
}

function checkEmojiPicker (e) {
    if (!e.target.closest(".emojiMaker")) {
        if (!document.getElementById("emojiContainer").classList.contains("hide")) hide(elementById("emojiContainer"));
    };
}

/**
 * 
 * @param {string} messageId 
 */
function profileParams(messageId, x, y) {
    socket.emit("profileParams", {messageId, token: tok()});

    socket.on("profileParamsContextMenu", menu => {
        const el = elementById("profileContextMenu")
        el.innerHTML = menu;
        el.style.top = y+"px";
        el.style.left = x+"px";
        hide(el, true);
    })
}

function parseProfileParamEvent (event) {
    if (event.target.closest(".username") || event.target.closest(".avatar")) {
        let thisItem = event.target;
        while (!thisItem.parentElement.classList.contains("chat-message")) {
            thisItem = thisItem.parentElement;
        }
        thisItem = thisItem.parentElement;
        profileParams(thisItem.id, event.pageX, event.pageY);
    } else {
        hide(elementById("profileContextMenu"))
    }
}
