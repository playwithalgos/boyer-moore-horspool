const CHARWIDTH = 40;
let pos = 0;

function randomWord(n) { return Array.from({ length: n }, () => Math.floor(Math.random() * 4)); }

const alphabets = [0, 1, 2, 3];
const word = randomWord(50);
const pattern = randomWord(5);
const colors = ["#EE4444", "#448822", "#4477DD", "#EEAA00"];

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

function moveHorizontallyOnDrag(el) {
    let x = 0;
    el.onmousedown = (evt) => {
        reset();
        x = evt.pageX;

        document.onmousemove = (evt) => {
            if (evt.buttons) {
                el.style.left = (parseInt(el.style.left ? el.style.left : 0) + evt.pageX - x) + "px";
                x = evt.pageX;
            }
        }

        document.onmouseup = (evt) => {
            pos = Math.round(parseInt(el.style.left ? el.style.left : 0) / CHARWIDTH);
            if(pos < 0) pos = 0;
            if(pos > word.length - pattern.length-1) pos= word.length - pattern.length - 1;
            el.style.left = (pos * CHARWIDTH) + "px";
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
    document.getElementById("word").children[pos + pattern.length - 1].classList.add("cursor");

}


function update() {
    reset();

    let k = pattern.length - 1;

    if(!document.getElementById("horspool").checked) {
        for (k = pattern.length - 1; k >= 0; k--) {
            if (pattern[k] == word[pos + k]) {
                document.getElementById("pattern").children[k].classList.add("match");
                document.getElementById("word").children[pos + k].classList.add("match");
            }
            else {
                document.getElementById("pattern").children[k].classList.add("dismatch");
                document.getElementById("word").children[pos + k].classList.add("dismatch");
                break;
            }
        }
    }

    const lastOcc = {};

    for (let i = 0; i < k; i++) {
        lastOcc[pattern[i]] = i;
    }

    for(let letter in lastOcc) 
        document.getElementById("pattern").children[lastOcc[letter]].classList.add("lastOccurrence");
    

}

update();

document.getElementById("horspool").onchange = update;