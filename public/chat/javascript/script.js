// new websocket
var socket = io();

const auth = `${window.location.origin}/auth`;
var editing;


// overlay
const classEdit = "fa-solid fa-pen-to-square";
const classSend = "fa-solid fa-paper-plane";


// Get the current username from the cookies
var tok = () => localStorage.getItem('token');
var discordAuth = localStorage.getItem("discordAuthKey");

if (!tok()) {
    window.location.href = auth

} else socket.emit("displayUserNameOnChat", tok());

// The user count. Can change when someone joins/leaves
// socket.on('count', function (data) {
//     $('.user-count').html("Онлайн: " + data);
// });

// Display username
socket.on("displayUserNameOnChat", (name) => {
    document.getElementById("accountName").innerHTML = name
})

// hitem list
socket.emit("hitemRequest", null);
socket.on("hitemList", list => {
    elementsByClass("hmove")[0].innerHTML = list
})

// When we receive a message
// it will be like { user: 'username', message: 'text' }
socket.on('message', function (data) {
    // console.log(data)
    $('.chat-history').append(data);

});

document.getElementById("logout").onclick = () => {
    localStorage.removeItem("token")
    socket.emit("logout", null);
    window.location.href = auth
}

// get last 100 messages at opening 
window.onload = () => {
    socket.emit("100msgRequest", {start: null, scroll: true});
}

socket.on("100msg", ({html: data, scroll, start}) => {
    document.getElementsByClassName("chat-history")[0].innerHTML = data + (document.getElementsByClassName("chat-history")[0].innerHTML || "");
    if (scroll) scrollChatTo(start);
    const chat = elementsByClass("chat")[0];
    chat.addEventListener("scroll", (e) => {
        if (chat.scrollTop === 0) {

            const history = chat.children.namedItem("chat-history");
            
            socket.emit("100msgRequest", {start: history.children[0].id});
        }
    })
})

socket.on("privateScrollBottom", (id) => {
    scrollChatTo(id)
})


// When the form is submitted
function sendMessage() {
    // Retrieve the message from the user
    var message = $("#messageInput").val();
    const check = message.split("\n").join("").split(" ").join("");
    const input = getPendingImages(true).map(file => { return { buffer: file, name: file.name } });
    if (((!input || input.length === 0) && !check && !editing) || !tok()) return;
    // Send the message to the server
    // console.log(input)
    socket.emit('messageGot', {
        userToken: tok(),
        message: message,
        files: input,
        editing
    });
    editing = undefined;

    elementById("sendMessage").children[0].classList.value = classSend;
    if (input?.length >= 1) {
        const fd = new FormData();
        input.forEach((file) => {
            console.log(file.buffer);
            fd.append("image", file.buffer), file.name;
        })
        const xhr = new XMLHttpRequest();
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                // we done!
            }
        };

        // path to server would be where you'd normally post the form to
        xhr.open('POST', '/chat/image', true);
        xhr.send(fd);
    }

// Clear the input and focus it for a new message
removeChildren(elementById("column"))
$("#messageInput").val("");
};


socket.on("onlineMembersChange",
    /**
     * 
     * @param {{avatar: string, biography: string, username: string}[]} users 
     */
    (users) => {
        const divs = [];
        users.forEach(user => {
            divs.push(
                newDiv(newImg(null, {width: 50, height: 50, src: user.avatar, class: ["onlineMemberAvatar"]}).outerHTML + newDiv(`
                    
                    ${newH(user.username, {size: 5, class: ["onlineMemberUsername"]}).outerHTML}
                    ${newP(user.status || "", {class: ["onlineMemberBio"]}).outerHTML}
                `, {class: ["onlineMemberContent"]}).outerHTML, {class: ["onlineMember"]}).outerHTML
            )
        })

        elementById("online-members-count").innerHTML = users.length || 0;
        elementById("membership").innerHTML = divs.join("<hr>");
    }
);



document.getElementById("messageInput").onkeydown = (e) => {
    if (!e.shiftKey && e.key === "Enter") {
        setTimeout(() => document.getElementById("sendMessage").click(), 50);
    }
}


socket.on("messageDeleted", message => {
    const msg = document.getElementById(message.id);
    if (msg) msg.style.display = 'none';
    const hr = document.getElementById(`HR-${message.id}`);
    if (hr) hr.style.display = 'none';
    hideMenu(null, true)
})

const maxImagesLength = 10;

elementById("uploadImagesInput").addEventListener("change", (e) => {

    const input = elementById("uploadImagesInput");

    if (!input.files || input.files.length === 0) return;
    var files = [];
    for (let i = 0; input.files[i]; i++) {
        files.push(input.files[i]);
    }
    if (getPendingImages().length + files.length > maxImagesLength) return invalidCode(2);
    hide(elementById("spaceForImages"), true)

    files.forEach(file => forEach(file));
    function forEach(file) {
        if (!["image/png", "image/jpg", "image/jpeg"].includes(file.type)) return
        const reader = new FileReader();
        reader.onload = (ev) => {
            const row = elementById("column");
            const randomString = Math.random() + Math.random() + "";
            // row.innerHTML += `<img class="pendingImage" src="${ev.target.result}"></img>`
            row.appendChild(newDiv([newDiv('<i class="fa-solid fa-xmark"></i>', { class: ["removeX"], onclick: (e) => { hide(elementById("IM-" + randomString)) } }), newImg(null, { src: ev.target.result, class: ["pendingImage"] })], { class: ["pendingImageData"], id: "IM-" + randomString }))
            scrollChatTo()
        }
        reader.readAsDataURL(file);
    }

})

socket.on("allowEditing", ({message}) => {
    $('#messageInput').val(message.content);  
    editing = message.id
    elementById("sendMessage").children[0].classList.value = classEdit;
})

socket.on("messageEdited", ({messageId, content}) => {
    elementById("Content-" + messageId).innerHTML = content;
})