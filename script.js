let runningTotal = 0;
let buffer = "0";
let previousOperator;

const screen = document.querySelector('.screen');

function buttonClick(value) {
    if (isNaN(value)) {
        handleSymbol(value);
    } else {
        handleNumber(value);
    }
    screen.innerText = buffer;
}

function handleSymbol(symbol) {
    switch (symbol) {
        case "C":
            buffer = '0';
            runningTotal = 0;
            break;
        case '=':
            if (previousOperator === null) {
                return;
            }
            flushOperation(parseFloat(buffer));
            previousOperator = null;
            buffer = runningTotal;
            runningTotal = 0;
            break;
        case '←':
            if (buffer.length === 1) {
                buffer = '0';
            } else {
                buffer = buffer.slice(0, buffer.length - 1);
            }
            break;
        case '+':
        case '-':
        case 'x':
        case '÷':
            handleMath(symbol);
            break;
        case '.':
            // Allow only one dot in the buffer
            if (!buffer.includes('.')) {
                buffer += symbol;
            }
    }
}

function handleMath(symbol) {
    if (buffer === '0') {
        return;
    }

    const floatBuffer = parseFloat(buffer);

    if (runningTotal === 0) {
        runningTotal = floatBuffer;
    } else {
        flushOperation(floatBuffer);
    }
    previousOperator = symbol;
    buffer = '0';
}

function flushOperation(floatBuffer) {
    if (previousOperator === '+') {
        runningTotal += floatBuffer;
    } else if (previousOperator === '-') {
        runningTotal -= floatBuffer;
    } else if (previousOperator === 'x') {
        runningTotal *= floatBuffer;
    } else if (previousOperator === '÷') {
        // Check for division by zero
        if (floatBuffer === 0) {
            runningTotal = "UND";
        } else {
            // Perform division
            runningTotal /= floatBuffer;
            // Limit the result to two decimal places without rounding
            runningTotal = Number(runningTotal.toFixed(2));
        }
    }
}


function handleNumber(numberString) {
    // Allow adding the decimal point if it hasn't been used yet and the buffer is not empty
    if (numberString === '.') {
        if (buffer.includes('.')) {
            // Avoid adding multiple decimal points
            return;
        }
        if (buffer === '') {
            buffer = '0';
        }
    }

    if (buffer === "0") {
        buffer = numberString;
    } else {
        // Limit the number of decimal places to two
        if (numberString === '.' && buffer.includes('.') && buffer.split('.')[1].length >= 2) {
            return;
        }
        buffer += numberString;
    }
}

function init() {
    document.querySelector('.calc-buttons').addEventListener('click', function (event) {
        buttonClick(event.target.innerText);
    });
}

init();
