import { createPicker } from 'https://unpkg.com/picmo@5.0.0/dist/index.js';

const rootElement = () => elementById('emojiContainer');
const button = document.getElementById('emojiPicker');
const input = document.getElementById("messageInput")

button.onclick = () => {
  const cont = rootElement();
  if (cont.classList.contains("hide")) {
    hide(cont, true);
  } else {
    hide(cont);
  }
}

const picker = createPicker({
  rootElement: rootElement()
})

picker.addEventListener('emoji:select', selection => {
  // handle the selected emoji here
  input.value += selection.emoji
});
