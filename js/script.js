const gamesDiv = document.querySelector('.games');
let gameMode = document.querySelector('.header .content .gameModes div.active').getAttribute('gameMode');
let word;
let currentInput = 0;
let currentRow = 0;

// scoreboard variables
let wins = localStorage.getItem('wins') != null ? localStorage.getItem('wins') : 0;
let games = localStorage.getItem('games') != null ? localStorage.getItem('games') : 0;
let tries = localStorage.getItem('tries') != null ? localStorage.getItem('tries') : 0;

// functions for the game functionality

const generateGame = () => {
    gamesDiv.innerHTML = '';
    for(let cont = 0; cont < gameMode; cont++) {
        gamesDiv.innerHTML += `<div class="game"></div>`;
        for(let i = 0; i < 6; i++) {
            document.querySelectorAll('.game')[cont].innerHTML += `<div class="row ${i === 0 ?'active' : 'disabled'}"></div>`;
            for(let j = 0; j < 5; j++) {
                document.querySelectorAll('.game')[cont].querySelectorAll('.row')[i].innerHTML += `<div class="input" contenteditable="${i === 0}" tabindex="0" index="${j}" onkeydown="changeInputFocus(event)" onclick="inputClick(event)"></div>`;
            }
        }
    }
    fetch("json/words.json")
    .then((response) => response.json())
    .then((json) => {
        word = json[Math.floor(Math.random() * 1000)].toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
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
    } else if(e.keyCode === 16 || e.keyCode === 17 || e.keyCode === 18 || e.keyCode === 91 || e.keyCode === 222) {
        e.preventDefault();
        return;
    } else if(e.keyCode === 13) {
        pressEnterKey();
    }
    
    if(currentInput < 5 && e.keyCode !== 8 && e.keyCode !== 13) {
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
    document.querySelectorAll('.row')[id].querySelectorAll('.input').forEach((input) => input.setAttribute('onkeydown', ''));
    document.querySelectorAll('.row')[id].querySelectorAll('.input').forEach((input) => input.setAttribute('contenteditable', 'false'));
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
        checkVictory(rightChars);
        if(currentRow == document.querySelectorAll('.row').length) {
            console.log('O jogo acabou');
            disableRow(currentRow-1);
        } else {
            disableRow(currentRow-1);
            enableRow(currentRow);
            setTimeout(() => {
                document.querySelectorAll('.row')[currentRow].firstChild.focus();
            }, 10);
        }
    }
}

let inputWord = [];
const checkWord = () => {
    inputWord = [];
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
    tries++;
    updateScore();
    return rightChars;
}

const checkVictory = (rightChars) => {
    if(rightChars == inputWord.length) {
        winGame();
    } else if(currentRow == document.querySelectorAll('.row').length) {
        loseGame();
    }
}

const winGame = () => {
    setTimeout(() => {
        alert('VOCÊ GANHOU O JOGO!');
    }, 10)
    console.log('VOCÊ GANHOU O JOGO!')
    games++;
    wins++;
    updateScore();
}

const loseGame = () => {
    console.log('VOCÊ PERDEU O JOGO :(')
    console.log('A PALAVRA ERA "'+word+'"')
    setTimeout(() => {
        alert('VOCÊ PERDEU O JOGO :(');
        alert('A PALAVRA ERA "'+word+'"');
    }, 10)
    games++;
    updateScore();
}

const updateScore = () => {
    localStorage.setItem('wins', wins);
    localStorage.setItem('games', games);
    localStorage.setItem('tries', tries);
    document.querySelectorAll('.top .score span')[0].innerText = wins;
    document.querySelectorAll('.top .score span')[1].innerText = games;
    document.querySelector('.top .tries span').innerText = tries;
}

const restart = () => {
    location.reload();
}

// functions for the game mode

const changeGameMode = (e) => {
    document.querySelectorAll('.header .content .gameModes div').forEach((mode) => mode.classList.remove('active'));
    e.target.classList.add('active');
    gameMode = document.querySelector('.header .content .gameModes div.active').getAttribute('gameMode');
    generateGame();
}

// functions for the game theme

let theme = 'dark';

const changeTheme = () => {
    theme = theme == 'light' ? 'dark' : 'light';
    updateTheme(theme);
}

const updateTheme = (theme) => {
    document.querySelector('.header .theme .toggle img').setAttribute('src', `assets/${theme}-theme.svg`);
    document.querySelector('html').classList.toggle('dark');
}

// executing functions for the game functionality

generateGame();
updateScore();

document.addEventListener('keydown', (event) => {
    if(event.keyCode === 13) {
        pressEnterKey();
    }
})
document.querySelector('.restart').addEventListener('click', restart);

// executing functions for the game mode

document.querySelectorAll('.header .content .gameModes div').forEach((mode) => {
    if(!mode.classList.contains('disabled')) {
        mode.addEventListener('click', () => { changeGameMode(event) });
    }
});

// executing functions for the game theme

updateTheme(theme);
document.querySelector('.header .theme').addEventListener('click', changeTheme);