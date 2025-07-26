// Calculator logic:

let divide = (first, second) => {return first / second;};
let multiply = (first, second) => {return first * second;};
let subtraction = (first, second) => {return first - second;};
let sum = (first, second) => {return first + second;};

let operators = ['×', '÷', '+', '-', '.'];

let parseNumber = (n) => {
    return (Number(n) === n && n % 1 === 0) ? parseInt(n) : parseFloat(n);
};

let compute = (equation) => {
    let functions = {
        "÷": divide,   
        "×": multiply,  
        "-": subtraction,       
        "+": sum       
    };

    let parameters = equation.split(/[-+÷×]/).map(n => parseNumber(n));
    if (parameters[1] === NaN)
        return parameters[0];
    let operators = [];
    // Split operators
    for(let i = 0; i < equation.length; i++)
    {
        if ( /\d/.test(equation[i]) == false && equation[i] != ".")
        {
            operators.push(equation[i]);
        }
    }
    let tempParam = parameters;
    // Complete division and muplication
    for (let i = 0; i < operators.length; i++)
    {
        if (operators[i] == '÷' || operators[i] == '×')
        {
            let res = functions[operators[i]](parameters[i], parameters[i+1]);
            parameters.splice(i, 1);
            operators.splice(i, 1);
            parameters[i] = res; 
            i--;
        }
    }

    // Complete substraction and summation
    for (let i = 0; i < operators.length; i++)
    {
        let res = functions[operators[i]](parameters[i], parameters[i+1]);
        parameters.splice(i, 1);
        operators.splice(i, 1);
        parameters[i] = res; 
        i--;
    }

    return parameters[0];
};

// User interaction:
let isResult = false;
const buttons = document.querySelectorAll('.button');
const handleKey = (key) => {
    proccesValue(key);
};
const handleClick = (event) => {
    proccesValue(event.target.id);
};

buttons.forEach(button => {
    button.addEventListener('click', handleClick);
});

let currentButton;
const keypad = document.querySelectorAll('.keypad');
document.addEventListener("keydown", (event) => {   
    buttons.forEach ((b) => {
        if (b.id === event.key){
            handleKey(event.key);
            b.classList.add("button-active");
            currentButton = b;
        }
    });
});

document.addEventListener("keyup", function(event) {
    buttons.forEach ((b) => {
        if (b.id === event.key){
            b.classList.remove("button-active");
        }
    });
});

let checkDot = (equation) => {
    let check = ['×', '÷', '+', '-'];
    for (let i = equation.length - 1; i >= 0; i--)
    {
        if ((equation[i] === '.'))
        {
            for (let b = i - 1; i >= 0; i--)
            {
                if (check.includes(equation[i+1]))
                    break;
                else if (equation[i+1] === '.')
                    return false;
            }
            return true;
        }
        else if (check.includes(equation[i-1]))
            return true;

    }
    return true;
};

let resultCount = () => {
    const results = document.querySelectorAll('.result');
    if (results.length > 0)
    {
        results.forEach(element => {
            if (results.length !== 0)
                element.remove()
        });
    }
};

let currentEquation = document.querySelector(".input");
let proccesValue = (key) => {
    if (isResult)
    {
        const parent = document.querySelector('.operation-list');
        const lastInput = document.querySelector('.input');
        const lastResult = document.querySelector('.result');
        const newInput = document.createElement('div');
        newInput.classList.add('operation');
        newInput.classList.add('input');
        newInput.innerHTML = '<span class=\"cursor\"></span>';
        if (lastInput !== null)
            lastInput.classList.remove('input');
        if (lastResult !== null)
            lastResult.classList.remove('result');
        parent.appendChild(newInput);
        currentEquation = newInput;
        isResult = false;
    }

    if (key === "*")
        key = '×';
    else if (key === '/')   
        key = '÷';

    if (((currentEquation.textContent.length !== 15)  && currentEquation.textContent.length !== 0) || (!(operators.includes(key))))
        removeCursor();
    let lastIndex = currentEquation.textContent[currentEquation.textContent.length - 1];
    if (currentEquation.textContent.length > 0 && currentEquation.textContent.length <= 14)
    {
        if (key === '.')
        {
            if (currentEquation.innerHTML.length < 2 || checkDot(currentEquation.innerHTML))
                addValue(key);
        }
        else if (operators.includes(key) && !operators.includes(lastIndex))
            addValue(key);
    }    
    if (!operators.includes(key) && currentEquation.innerHTML.length <= 14)
    {
        addValue(key);
    }
    if ((key == "Enter" || key == "Backspace" || key == "Escape") && currentEquation.textContent.length === 15)
        addValue(key);
    };

let addValue = (key) => {
    switch(key) {
        case "Escape":
            currentEquation.innerHTML = "";
            addCursor(currentEquation);
            break;
        case "Backspace":
            if (currentEquation.innerHTML.length > 0)
                currentEquation.textContent = currentEquation.textContent.slice(0, -1);
                addCursor(currentEquation);
            break;
        case "Enter":
            if (currentEquation.innerHTML.length > 0)
                outputResult(compute(currentEquation.textContent));
            break;
        default:
            currentEquation.innerHTML += key + "<span class=\"cursor\"></span>";
    };
};

let removeCursor = () => {
    const cursor = document.querySelector(".cursor");
    if (cursor !== null)
        cursor.remove();
};

let addCursor = (node) => {
    const cursor = document.createElement('span');
    cursor.classList.add('cursor');
    node.appendChild(cursor);
};

let outputResult = (result) => {
    const parent = document.querySelector('.operation-list');
    const equationEl = document.querySelector(".input");
    const output = document.createElement('div');
    output.classList.add('operation');
    output.classList.add('result');
    equationEl.classList.add("slide-up");

    isResult = true;

    equationEl.addEventListener("animationend", function handler() {
        parent.appendChild(output);
        if (result   % 1 === 0)
            output.innerHTML = '= ' + result;
        else if (isNaN(result))
            output.innerHTML = 'Error';
        else 
        {
            let [beforeDot, afterDot] = String(result).split('.');
            if (afterDot.length > 5)
                afterDot = afterDot.slice(0, 5);
            output.innerHTML = '= ' + beforeDot + '.' + afterDot;
        }

        output.classList.add("fade-in");  

        // Clean up for next use
        equationEl.classList.remove("slide-up");
        equationEl.removeEventListener("animationend", handler);
    });
    resultCount(); // Check if typing too fast
};