let hamburger = document.getElementsByClassName("hamburger")[0];

let navul = document.querySelector(".navul");

let bar = document.getElementsByClassName("bar");

hamburger.addEventListener("click", () => {
    navul.classList.toggle("navActive");
    for(var i = 0; i<3; i++)
        bar[i].classList.toggle("hamburgerActive")
});
