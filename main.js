

/**
 * 
 * @param {*} n 
 * @returns a random Word (represented as an array) where letters are 
 */
function randomWord(n) { return Array.from({ length: n }, () => String.fromCharCode(65 + Math.floor(Math.random() * 4))); }

const colors = { "A": "#EE4444", "B": "#448822", "C": "#4477DD", "D": "#EEAA00" };
const pattern = randomWord(5);
const text = addPatternAroundTheEnd(randomWord(40), pattern);

/**
 * 
 * @param {*} text 
 * @param {*} pattern 
 * @returns place the pattern in the text
 */
function addPatternAroundTheEnd(text, pattern) {
    const b = text.length - pattern.length - 1 - Math.floor(Math.random() * 4);
    for (let i = 0; i < pattern.length; i++)
        text[b + i] = pattern[i];
    return text;
}

let pos = 0;
let cursor = pattern.length - 1;

/**
 * compute the last occurrence table
 */
const lastOcc = {};
for (let i = 0; i < pattern.length - 1; i++) {
    lastOcc[pattern[i]] = i;
}

/**
 * 
 * @param {*} el 
 * @param {*} word 
 * @description fill the DOM element el with the word
 */
function fill(el, word) {
    for (const char of word) {
        const charElement = document.createElement("div");
        charElement.classList.add("char");
        charElement.innerText = char;
        charElement.style.background = colors[char];
        el.appendChild(charElement);
    }
}

fill(document.getElementById("word"), text);
fill(document.getElementById("pattern"), pattern);

const CHARWIDTH = (document.getElementById("word").children[text.length - 1].getBoundingClientRect().left - document.getElementById("word").children[0].getBoundingClientRect().left) / text.length;

function isArrayEquals(a, b) { return a.length === b.length && a.every((val, index) => val === b[index]); }

//win if the pattern matches the portion in the text
function isWin() { return isArrayEquals(pattern, text.slice(pos, pos + pattern.length)); }


function nextCorrectPos() {
    return isWin() ? pos : pos + (lastOcc[text[pos + pattern.length - 1]] != undefined ? (pattern.length - 1 - lastOcc[text[pos + pattern.length - 1]]) : pattern.length);
}


function getMousePos(evt) {
    if (evt.pageX)
        return { x: evt.pageX, y: evt.pageY };
    else if (evt.touches)
        return { x: evt.touches[0].pageX, y: evt.touches[0].pageY };
    else
        return { x: 0, y: 0 };
}
/**
 * 
 * @param {*} el
 * @description makes that the element (the pattern) el moves horizontal 
 */
function moveHorizontallyOnDrag(el) {
    let x = 0;
    el.onmousedown = (evt) => {

        reset();
        document.getElementById("word").children[cursor].classList.add("cursor");
        x = getMousePos(evt).x;
        console.log(x)
        document.onmousemove = (evt) => {
            const newX = getMousePos(evt).x;
            console.log(newX)
            if (evt.buttons) {
                el.style.left = (parseInt(el.style.left ? el.style.left : 0) + newX - x) + "px";
                x = evt.pageX;
            }
        }
        document.onmouseup = (evt) => {
            let bestX = 100000;
            let newpos = undefined
            for (let i = 0; i < text.length; i++) {
                const d = Math.abs(document.getElementById("word").children[i].getBoundingClientRect().left - document.getElementById("pattern").getBoundingClientRect().left);
                if (d < bestX) {
                    bestX = d;
                    newpos = i;
                }
            }

            if (newpos == nextCorrectPos()) {
                pos = newpos;
                if (isWin()) {
                    document.getElementById("pattern").classList.add("bravo");
                    document.body.classList.add("bravo");
                }
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
        document.ontouchmove = (evt) => {
            console.log(getMousePos(evt).x);
            el.style.left = (parseInt(el.style.left ? el.style.left : 0) + getMousePos(evt).x - x) + "px";
            x = getMousePos(evt).x;
        }
        document.ontouchend = document.onmouseup;
    }

    el.ontouchstart = el.onmousedown;
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
            if (pattern[k] == text[pos + k]) {
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
