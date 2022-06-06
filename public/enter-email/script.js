const socket = io();

document.getElementById("forM").onsubmit = (e) => {
    e.preventDefault()
    const input = document.getElementById("mail");
    if (!input?.validity?.valid && input.value !== "") return;
    const email = input.value;
    socket.emit("checkEmail", email);
}

socket.on("emailVerified", data => {
    if (!data) return invalidCode(1);
    socket.emit("sendCode", data);
    localStorage.setItem("temp", data.token+data.token);
    window.location.href = `${window.location.protocol}//${window.location.host}/get-code`
})

function invalidCode (code, timeout = 5000) {
    $(".notify").addClass("active");
    $("#notifyType").addClass("fail"+code);
        
    setTimeout(function(){
        $(".notify").removeClass("active");
        $("#notifyType").removeClass("fail"+code);
    },timeout);
}
  