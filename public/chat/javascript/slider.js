const spac = () =>  elementsByClass("slider-image-space")[0];

function sliderTo(n) {
    const space = spac();
    const c = [];
    for (let i = 0; i < space.children.length; i++) c.push(space.children[i]);
    const i = c.findIndex(e => e.classList.contains("active"))
    var next = i + n;
    if (next < 0) {
        next = c.length - 1
    } else if (next === c.length) {
        next = 0;
    }
    space.children[i].classList.remove("active");
    space.children[i].classList.add("hide");
    space.children[next].classList.add("active");
    space.children[next].classList.remove("hide");
}