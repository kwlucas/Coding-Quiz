var viewScoresBtnEl = document.querySelector('#view-scores');

var contentHeaderEl = document.querySelector('#content-head');
var contentBodyEL = document.querySelector('#content-body');
var contenFooterEl = document.querySelector('#content-foot');

var score = 0;
var questionNum = 0;
var questionQueue = [];
var interval; //for the setInterval ID

function arrayRandomizer(array) {
    let randomizedArray = [];
    while (randomizedArray.length !== array.length) {
        let val = array[Math.floor(Math.random() * array.length)];
        if (!randomizedArray.includes(val)) {
            randomizedArray.push(val)
        }
    }
    return randomizedArray;
}

//Function to set layout for before quiz.
function setUpTitleScreen() {
    viewScoresBtnEl.removeAttribute('disabled');
    viewScoresBtnEl.addEventListener('click', displayScores);
    contentHeaderEl.textContent = 'Coding Quiz!';
    contenFooterEl.textContent = 'Once you hit start you will have 60 seconds to correctly answer as many questions as possible.';
    const startButton = document.createElement('button');
    startButton.textContent = 'Start Quiz';
    contentBodyEL.appendChild(startButton);
    startButton.addEventListener('click', startQuiz);
}
//Function to set layout for during the quiz.
function startQuiz(event) {
    const startButton = event.target;
    questionQueue = arrayRandomizer(questionList);
    timerEl.textContent = '';
    contentHeaderEl.textContent = '';
    contenFooterEl.textContent = '';
    viewScoresBtnEl.setAttribute('disabled', '');
    startTimer(60);
    startButton.removeEventListener('click', startQuiz);
    startButton.remove();
    questionNum = 1;
    displayQuestion(questionQueue.shift())
}
//Fucntion to set layout for viewing high scores.
//clear local storage when clear scores button is pressed.

//Start timer fuction
function startTimer(seconds) {
    const timerEl = document.querySelector('#timer');
    interval = setInterval(updateTime, 1000);
    function updateTime() {
        timerEl.textContent = `Time: ${seconds}`;
        if (seconds <= 0) {
            quizOver();
        }
        else {
            seconds--;
        }
    }
}

//Function to take correct and incorrect answers and place buttons for each one on the screen //randomize the order of the buttons
function displayQuestion(questionObj) {
    let { question = '', correctAnswers = [], wrongAnswers = [] } = questionObj;
    let answers = arrayRandomizer(correctAnswers.concat(wrongAnswers));
    contentHeaderEl.textContent = question;
    for (let i = 0; i < answers.length; i++) {
        let ansButton = document.createElement('button');
        ansButton.textContent = `${i + 1}. ${answers[i]}`;
        ansButton.classList.add('answer-btn');
        if (correctAnswers.includes(answers[i])) {
            ansButton.classList.add('select-effect-success');
        }
        else {
            ansButton.classList.add('select-effect-danger');
        }
        contentBodyEL.appendChild(ansButton);
        ansButton.addEventListener('click', answerPressed);
    }

}

//Function for when an answer is pressed. Value assigned to button indicates right or wrong answer. Adjust score accordingly
function answerPressed(event) {
    const btn = event.target;
    if (btn.classList.contains('select-effect-success')) {
        score += 10;
    }
    contenFooterEl.textContent = `Score: ${score}\nCorrect: ${score / 10}\nIncorrect: ${questionNum - (score / 10)}\nQuestions: ${questionNum}`;
    document.querySelectorAll('.answer-btn').forEach(ansButton => {
        ansButton.removeEventListener('click', answerPressed);
        ansButton.remove();
    });
    if (questionQueue.length > 0) {
        displayQuestion(questionQueue.shift());
    }
    else{
        quizOver();
    }
}
//When out of time OR all questions answered end game function
function quizOver() {
    let formEl = document.createElement('form');
    let nameLabelEl = document.createElement('label');
    let nameInputEl = document.createElement('input');
    let divsEl = document.createElement('div');
    let submitBtnEl = document.createElement('button');
    let skipBtnEl = document.createElement('button');
    contentHeaderEl.textContent = `Your score is ${score}!\nWant to save it?`;
    formEl.classList.add('formItem');
    nameLabelEl.setAttribute('for', 'name');
    nameLabelEl.textContent = 'Name/Nickname:';
    nameLabelEl.classList.add('formItem');
    nameInputEl.setAttribute('id', 'name');
    nameInputEl.setAttribute('name', 'name');
    nameInputEl.setAttribute('required', '');
    nameInputEl.setAttribute('type', 'text');
    nameInputEl.setAttribute('placeholder', 'Name/Nickname');
    nameInputEl.classList.add('formItem');
    divsEl.classList.add('container', 'formItem');
    submitBtnEl.setAttribute('type', 'submit');
    submitBtnEl.textContent = 'Submit';
    submitBtnEl.classList.add('success', 'formItem');
    skipBtnEl.textContent = 'Skip';
    skipBtnEl.classList.add('info', 'formItem');
    clearInterval(interval);
    timerEl.textContent = '';
    contentBodyEL.appendChild(formEl);
    formEl.appendChild(nameLabelEl);
    formEl.appendChild(nameInputEl);
    formEl.appendChild(divsEl);
    divsEl.appendChild(skipBtnEl);
    divsEl.appendChild(submitBtnEl);
    formEl.addEventListener('submit', (event) => {
        localStorage.setItem(nameInputEl.value, score);
        document.querySelectorAll('.formItem').forEach(element => {
            element.remove();
        });
        setUpTitleScreen();
    });
    skipBtnEl.addEventListener('click', (even) => {
        document.querySelectorAll('.formItem').forEach(element => {
            element.remove();
        });
        setUpTitleScreen();
    });
}

//end game function makes layout for entering score.

//function to load and display scores

function displayScores(){
    //
}

//on load retrieve local storage scores
window.addEventListener('load', function () {
    setUpTitleScreen();
});

var questionList = [
    {
        question: 'Question 1',
        correctAnswers: ['Correct'],
        wrongAnswers: ['Incorrect 1', 'Incorrect 2', 'Incorrect 3']
    },
    {
        question: 'Question 2',
        correctAnswers: ['Correct'],
        wrongAnswers: ['Incorrect 1', 'Incorrect 2', 'Incorrect 3']
    },
    {
        question: 'Question 3',
        correctAnswers: ['Correct 1', 'Correct 2'],
        wrongAnswers: ['Incorrect 1', 'Incorrect 2']
    },
    {
        question: 'Question 4',
        correctAnswers: ['Correct'],
        wrongAnswers: ['Incorrect 1', 'Incorrect 2', 'Incorrect 3']
    },
    {
        question: 'Question 5',
        correctAnswers: ['Correct'],
        wrongAnswers: ['Incorrect 1', 'Incorrect 2', 'Incorrect 3']
    }
]