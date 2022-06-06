if (!localStorage.getItem("temp")) `${window.location.protocol}//${window.location.host}/chat`

const socket = io();

const getCodes = () => document.querySelectorAll('.code')

const codes = getCodes();

codes[0].focus()

codes.forEach((code, idx) => {
    code.addEventListener('keydown', (e) => {
        if(e.key >= 0 && e.key <=9 && idx !== codes.length) {
            codes[idx].value = ''
            setTimeout(() => codes[idx + 1 === codes.length ? idx : idx + 1].focus(), 10)
        } else if(e.key === 'Backspace') {
            setTimeout(() => codes[idx - 1].focus(), 10)
            return;
        }

    })
})

document.getElementById("check").onclick = () => {
    // if (!localStorage.getItem("temp")) return;

    const arr = [...getCodes().values()]
    if ((arr.some(e => e.value === ""))) return invalidCode(1)
    const password = document.getElementById("newPassword").value;
    if (!password || password.length < 4) return invalidCode(2);
    var code = "";
    arr.forEach(e => code += e.value);
    socket.emit("verifyCode", {temp: localStorage.getItem("temp"), code, password})
}

socket.on("resetResult", (code) => {
    codes.forEach((e, i) => {
        e.value = '';
    })
    document.getElementById("newPassword").value = "";
    invalidCode(code);
    if (code === 4) {
        localStorage.removeItem("temp")
        setTimeout(() => {
            window.location.href = `${window.location.protocol}//${window.location.host}/auth`
        }, 2000)
    }
})

function invalidCode (code) {
    $(".notify").addClass("active");
    $("#notifyType").addClass("fail"+code);
        
    setTimeout(function(){
        $(".notify").removeClass("active");
        $("#notifyType").removeClass("fail"+code);
    },5000);
}
  