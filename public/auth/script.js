const socket = io();

const nameOrEmail = () => document.getElementById("usernameOrEmail");
const password = () => document.getElementById("password");
const passwordReg = () => document.getElementById("passwordReg");
const email = () => document.getElementById("email");
const username = () => document.getElementById("username");

const submitButton = document.getElementById("submit");
const submitRegButton = document.getElementById("submitReg");
if (localStorage.getItem("token")) window.location.href = `${window.location.protocol}//${window.location.host}/chat`

const verifButton = document.getElementById("forgot-pass");
verifButton.onclick = () => {
  window.location.href = `${window.location.protocol}//${window.location.host}/enter-email`
  // socket.emit("emailVerif", {email: "vip.makichyan@mail.ru"})
}

submitButton.onsubmit = (event) => {
  event.preventDefault();
  if (!nameOrEmail().validity.valid || !password().validity.valid) return;
  socket.emit("login", {
    nameOrEmail: nameOrEmail().value,
    password: password().value,
  })
  return;

}

submitRegButton.onsubmit = (event) => {
  event.preventDefault();
  if (!username().validity.valid || !passwordReg().validity.valid || !email().validity.valid) return;
  socket.emit("signup", {
    username: username().value,
    password: passwordReg().value,
    email: email().value,
  })
  return;
}

document.querySelector('.img__btn').addEventListener('click', function() {
  document.querySelector('.cont').classList.toggle('s--signup');
});

socket.on("redirectAndCookie", (obj) => {
  const {path=null, cookie: c } = obj;
  if (c) localStorage.setItem(c.key, c.value);
  if (path) window.location.href = `${window.location.protocol}//${window.location.host}/${path}`;
});

socket.on("authError", errCode => {
  invalidCode(errCode)
})

function invalidCode (code) {
  $(".notify").addClass("active");
  $("#notifyType").addClass("fail"+code);
      
  setTimeout(function(){
      $(".notify").removeClass("active");
      $("#notifyType").removeClass("fail"+code);
  },5000);
}