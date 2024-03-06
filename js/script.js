const game = document.querySelector('.game');
let currentInput = 0;
let currentRow = 0;

const generateGame = () => {
    for(let i = 0; i < 6; i++) {
        game.innerHTML += `<div class="row ${i === 0 ?'active' : 'disabled'}"></div>`;
        for(let j = 0; j < 5; j++) {
            document.querySelectorAll('.row')[i].innerHTML += `<div class="input" contenteditable="${i === 0}" tabindex="0" index="${j}" onkeydown="${i === 0 ? 'changeInputFocus(event)' : ''}"></div>`;
        }
    }
}

const changeInputFocus = (e) => {
    // console.log(e.target)

    if(e.key.match(/^[a-zA-Z]$/g)) {
        if(e.target.innerText != '') {
            e.target.innerText = '';
        }
        currentInput++;
        if(currentInput % 5 == 0) {
            currentRow++;
            document.querySelectorAll('.row')[currentRow].classList.remove('disabled');
            document.querySelectorAll('.row')[currentRow].classList.add('active');
            document.querySelectorAll('.row')[currentRow].addEventListener('keydown', () => { changeInputFocus(event) }); // PAREI AQUI 
            setTimeout(() => {
                document.querySelectorAll('.row')[currentRow].firstChild.focus();
            }, 10);
        } else {
            setTimeout(() => {
                e.target.nextSibling.focus();
            }, 10);
        }
    } else if(e.keyCode === 8) {
        e.target.innerText = '';
        currentInput--;
        if(currentInput < 0) {
            currentInput = 0;
        } else {
            setTimeout(() => {
                e.target.previousSibling.focus();
            }, 10);
        }
    }

    console.log(currentInput, currentRow)
}

generateGame();