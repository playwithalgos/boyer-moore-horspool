

function randomWord(n) { return Array.from({ length: n }, () => Math.floor(Math.random() * 4)); }

const alphabets = [0, 1, 2, 3];
const word = randomWord(40);
const pattern = randomWord(5);
const colors = ["#EE4444", "#448822", "#4477DD", "#EEAA00"];

let pos = 0;
let cursor = pattern.length - 1;

const lastOcc = {};

for (let i = 0; i < pattern.length - 1; i++) {
    lastOcc[pattern[i]] = i;
}

function fill(el, word) {
    for (const char of word) {
        const charElement = document.createElement("div");
        charElement.classList.add("char");
        charElement.innerText = String.fromCharCode(65 + char);
        charElement.style.background = colors[char];
        el.appendChild(charElement);
    }
}

fill(document.getElementById("word"), word);
fill(document.getElementById("pattern"), pattern);

const CHARWIDTH = (document.getElementById("word").children[word.length - 1].getBoundingClientRect().left - document.getElementById("word").children[0].getBoundingClientRect().left) / word.length;
function nextCorrectPos() {
    return pos + (lastOcc[word[pos + pattern.length - 1]] != undefined ? (pattern.length - 1 - lastOcc[word[pos + pattern.length - 1]]) : pattern.length);
}


function moveHorizontallyOnDrag(el) {
    let x = 0;
    el.onmousedown = (evt) => {
        reset();
        document.getElementById("word").children[cursor].classList.add("cursor");

        x = evt.pageX;

        document.onmousemove = (evt) => {
            if (evt.buttons) {
                el.style.left = (parseInt(el.style.left ? el.style.left : 0) + evt.pageX - x) + "px";
                x = evt.pageX;
            }
        }

        document.onmouseup = (evt) => {

            let bestX = 100000;
            let newpos = undefined
            for (let i = 0; i < word.length; i++) {
                const d = Math.abs(document.getElementById("word").children[i].getBoundingClientRect().left - document.getElementById("pattern").getBoundingClientRect().left);
                if (d < bestX) {
                    bestX = d;
                    newpos = i;
                }
            }

            if (newpos == nextCorrectPos()) {
                pos = newpos;
                document.getElementById("pattern").classList.add("bravo");
                setTimeout(() => document.getElementById("pattern").classList.remove("bravo"), 500);
            }
            else {
                console.log("correction position :", nextCorrectPos());
                console.log("wanted position", newpos);
                document.body.classList.add("error");
                setTimeout(() => document.body.classList.remove("error"), 500);
            }

            el.style.left = document.getElementById("word").children[pos].getBoundingClientRect().left - document.getElementById("word").getBoundingClientRect().left + "px";
            update();
        }
    }


}

moveHorizontallyOnDrag(document.getElementById("pattern"));

function reset() {
    document.querySelectorAll("#playground > * > *").forEach((e) => {
        e.classList.remove("match");
        e.classList.remove("lastOccurrence");
        e.classList.remove("dismatch");
        e.classList.remove("cursor");
    });

}




function update() {
    reset();

    let k = pattern.length - 1;
    cursor = pos + k;
    if (!document.getElementById("horspool").checked) {
        for (k = pattern.length - 1; k >= 0; k--) {
            if (pattern[k] == word[pos + k]) {
                document.getElementById("pattern").children[k].classList.add("match");
                document.getElementById("word").children[pos + k].classList.add("match");
            }
            else {
                document.getElementById("pattern").children[k].classList.add("dismatch");
                document.getElementById("word").children[pos + k].classList.add("dismatch");
                cursor = pos + k;
                break;
            }
        }
    }
    document.getElementById("word").children[cursor].classList.add("cursor");

    for (let letter in lastOcc)
        document.getElementById("pattern").children[lastOcc[letter]].classList.add("lastOccurrence");


}

update();

document.getElementById("horspool").onchange = update;