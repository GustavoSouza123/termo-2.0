const game = document.querySelector('.game');
let word;
let currentInput = 0;
let currentRow = 0;

const generateGame = () => {
    for(let i = 0; i < 6; i++) {
        game.innerHTML += `<div class="row ${i === 0 ?'active' : 'disabled'}"></div>`;
        for(let j = 0; j < 5; j++) {
            document.querySelectorAll('.row')[i].innerHTML += `<div class="input" contenteditable="${i === 0}" tabindex="0" index="${j}" onkeydown="changeInputFocus(event)" onclick="inputClick(event)"></div>`;
        }
    }
    fetch("json/words.json")
        .then((response) => response.json())
        .then((json) => {
            word = json[Math.floor(Math.random() * 1000)].toUpperCase();
        });
}

const inputClick = (e) => {
    currentInput = e.target.getAttribute('index');
    console.log('focus', currentInput, currentRow)
}

const changeInputFocus = (e) => {
    console.log(e.key, e.keyCode)
    
    currentInput = +e.target.getAttribute('index') + 1;

    if(e.key.match(/^[a-zA-Z]$/g)) {
        if(e.target.innerText != '') {
            e.target.innerText = '';
        }
    } else if(e.key.match(/^[0-9]$/g)) {
        e.preventDefault();
        return;
    } else if(e.keyCode === 8) {
        e.target.innerText = '';
        currentInput--;
        if(currentInput > 0) {
            setTimeout(() => {
                e.target.previousSibling.focus();
            }, 10);
        }
    } else if(e.keyCode === 37 || e.keyCode === 38) {
        currentInput--;
        if(currentInput > 0) {
            setTimeout(() => {
                e.target.previousSibling.focus();
            }, 10);
        }
        return;
    } else if(e.keyCode === 32) {
        e.preventDefault();
    } else if(e.keyCode === 16 || e.keyCode === 17 || e.keyCode === 18 || e.keyCode === 91) {
        e.preventDefault();
        return;
    } else if(e.keyCode === 13) {
        pressEnterKey();
    }

    if(currentInput < 5 && e.keyCode !== 13 && e.keyCode !== 8) {
        setTimeout(() => {
            e.target.nextSibling.focus();
        }, 10);
    } else {
        setTimeout(() => {
            e.target.blur();
        }, 10);
    }

    console.log('focus', currentInput, currentRow)
}

const disableRow = (id) => {
    document.querySelectorAll('.row')[id].classList.remove ('active');
    document.querySelectorAll('.row')[id].classList.add('disabled');
    document.querySelectorAll('.row')[id].querySelectorAll('.input').forEach((input) => input.setAttribute('tabindex', '-1'));
    document.querySelectorAll('.row')[id].querySelectorAll('.input').forEach((input) => input.setAttribute('onclick', ''));
}

const enableRow = (id) => {
    document.querySelectorAll('.row')[id].classList.remove('disabled');
    document.querySelectorAll('.row')[id].classList.add('active');
    document.querySelectorAll('.row')[id].querySelectorAll('.input').forEach((input) => input.setAttribute('contenteditable', 'true'));
}

const checkRowComplete = () => {
    if(currentRow < document.querySelectorAll('.row').length) {
        let inputs = document.querySelectorAll('.row')[currentRow].querySelectorAll('.input');
        for(i = 0; i < inputs.length; i++) {
            if(inputs[i].innerText == '') {
                console.log(i, false);
                return false;
            }
        }
        return true;
    }
}

const pressEnterKey = () => {
    let rowComplete = checkRowComplete();
    if(rowComplete) {
        currentRow++;
        let rightChars = checkWord();
        if(currentRow == document.querySelectorAll('.row').length) {
            console.log('O jogo acabou');
            disableRow(currentRow-1);
            checkVictory(rightChars);
        } else {
            disableRow(currentRow-1);
            enableRow(currentRow);
            setTimeout(() => {
                document.querySelectorAll('.row')[currentRow].firstChild.focus();
            }, 10);
        }
    }
}

const checkWord = () => {
    let inputWord = [];
    document.querySelectorAll('.row')[currentRow-1].querySelectorAll('.input').forEach((input) => inputWord.push(input.innerText));
    console.log(inputWord.join(''), word);
    let rightChars = 0;
    for(i = 0; i < inputWord.length; i++) {
        let currentInput = document.querySelectorAll('.row')[currentRow-1].querySelectorAll('.input')[i];
        if(inputWord[i] === word.charAt(i)) {
            currentInput.classList.add('right');
            rightChars++;
            console.log('right');
            continue;
        } else {
            currentInput.classList.add('wrong');
            console.log('wrong');
        }
        if(word.includes(inputWord[i])) {
            currentInput.classList.add('include');
            console.log('include')
        }
    }
    return rightChars;
}

const checkVictory = (rightChars) => {
    if(rightChars == inputWord.length) {
        winGame();
    } else {
        loseGame();
    }
}

const winGame = () => {
    setTimeout(() => {
        alert('VOCÊ GANHOU O JOGO!');
    }, 10)
    console.log('VOCÊ GANHOU O JOGO!')
}

const loseGame = () => {
    console.log('VOCÊ PERDEU O JOGO :(')
    setTimeout(() => {
        alert('VOCÊ PERDEU O JOGO :(');
    }, 10)
}

generateGame();
document.addEventListener('keydown', (event) => {
    if(event.keyCode === 13) {
        pressEnterKey();
    }
})