const game = document.querySelector('.game');
let currentInput = 0;
let currentRow = 0;

const generateGame = () => {
    for(let i = 0; i < 6; i++) {
        game.innerHTML += `<div class="row ${i === 0 ?'active' : 'disabled'}"></div>`;
        for(let j = 0; j < 5; j++) {
            document.querySelectorAll('.row')[i].innerHTML += `<div class="input" contenteditable="${i === 0}" tabindex="0" index="${j}" onkeydown="changeInputFocus(event)" onclick="inputClick(event)"></div>`;
        }
    }
}

const inputClick = (e) => {
    currentInput = e.target.getAttribute('index');
    console.log('focus', currentInput, currentRow)
}

const changeInputFocus = (e) => {
    // console.log(e.keyCode)
    
    currentInput = +e.target.getAttribute('index') + 1;

    if(e.key.match(/^[a-zA-Z]$/g)) {
        if(e.target.innerText != '') {
            e.target.innerText = '';
        }
    } else if(e.keyCode === 8) {
        e.target.innerText = '';
        if(currentInput > 0) {
            setTimeout(() => {
                e.target.previousSibling.focus();
            }, 10);
        }
    } else if(e.keyCode === 32) {
        setTimeout(() => {
            e.target.nextSibling.focus();
        }, 10);
    }

    setTimeout(() => {
        if(currentInput % 5 == 0) {
            let rowComplete = checkRowComplete();
            if(rowComplete) {
                currentRow++;
                if(currentRow == document.querySelectorAll('.row').length) {
                    console.log('O jogo acabou');
                    e.target.blur();
                    disableRow(currentRow-1);
                    return;
                } else {
                    disableRow(currentRow-1);
                    enableRow(currentRow);
                    setTimeout(() => {
                        document.querySelectorAll('.row')[currentRow].firstChild.focus();
                    }, 10);
                }
            }
        } else {
            setTimeout(() => {
                e.target.nextSibling.focus();
            }, 10);
        }
    }, 10)

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
    let inputs = document.querySelectorAll('.row')[currentRow].querySelectorAll('.input');
    for(i = 0; i < inputs.length; i++) {
        if(inputs[i].innerText == '') {
            console.log(i, false);
            return false;
        }
    }
    return true;
}


generateGame();