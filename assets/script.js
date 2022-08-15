var viewScoresBtnEl;
var timerEl;
var contentHeaderEl;
var contentBodyEl;
var contenFooterEl;

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
    startButton.classList.add('startBtn')
    startButton.textContent = 'Start Quiz';
    contentBodyEl.appendChild(startButton);
    startButton.addEventListener('click', startQuiz);
}
//Function to set layout for during the quiz.
function startQuiz(event) {
    const startButton = event.target;
    questionQueue = arrayRandomizer(questionList);
    timerEl.textContent = '';
    contentHeaderEl.textContent = '';
    contenFooterEl.textContent = '';
    viewScoresBtnEl.removeEventListener('click', displayScores);
    viewScoresBtnEl.setAttribute('disabled', '');
    startTimer(60);
    startButton.removeEventListener('click', startQuiz);
    startButton.remove();
    questionNum = 1;
    score = 0;
    displayQuestion(questionQueue.shift())
}
//Fucntion to set layout for viewing high scores.
//clear local storage when clear scores button is pressed.

//Start timer fuction
function startTimer(seconds) {
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
        contentBodyEl.appendChild(ansButton);
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
    questionNum++;
    if (questionQueue.length > 0) {
        displayQuestion(questionQueue.shift());
    }
    else {
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
    contentBodyEl.appendChild(formEl);
    formEl.appendChild(nameLabelEl);
    formEl.appendChild(nameInputEl);
    formEl.appendChild(divsEl);
    divsEl.appendChild(skipBtnEl);
    divsEl.appendChild(submitBtnEl);
    formEl.addEventListener('submit', (event) => {
        event.preventDefault();
        localStorage.setItem(nameInputEl.value, score);
        document.querySelectorAll('.formItem').forEach(element => {
            element.remove();
        });
        setUpTitleScreen();
    });
    skipBtnEl.addEventListener('click', (event) => {
        event.preventDefault();
        document.querySelectorAll('.formItem').forEach(element => {
            element.remove();
        });
        setUpTitleScreen();
    });
}

//end game function makes layout for entering score.

//function to load and display scores

function displayScores() {
    let clearBtnEl = document.createElement('button');
    let backBtnEl = document.createElement('button');
    let scoreArray = [];
    document.querySelector('.startBtn').remove();
    viewScoresBtnEl.removeEventListener('click', displayScores);
    viewScoresBtnEl.setAttribute('disabled', '');
    contentHeaderEl.textContent = 'High Scores';
    contenFooterEl.textContent = '';
    for (let i = 0; i < localStorage.length; i++) {
        scoreArray.push(`${localStorage.key(i)}!#!${localStorage.getItem(localStorage.key(i))}`);
    }
    //arrange the array in decending order of scores
    scoreArray.sort(function (a, b) { return Number(b.split('!#!')[1]) - Number(a.split('!#!')[1]) });
    for (let i = 0; i < scoreArray.length; i++) {
        let scoreEl = document.createElement('p');
        scoreEl.classList.add('score');
        scoreEl.textContent = `${i+1}. ${scoreArray[i].split('!#!')[0]}: ${scoreArray[i].split('!#!')[1]}`;
        contentBodyEl.appendChild(scoreEl);
    }
    clearBtnEl.classList.add('danger', 'scoreBtn');
    clearBtnEl.textContent = 'Clear Scores';
    contenFooterEl.appendChild(clearBtnEl);
    backBtnEl.classList.add('info', 'scoreBtn');
    backBtnEl.textContent = 'Back';
    contenFooterEl.appendChild(backBtnEl);
    clearBtnEl.addEventListener('click', function () {
        localStorage.clear();
        document.querySelectorAll('.score').forEach(element => {
            element.remove();
        });
    });
    backBtnEl.addEventListener('click', function () {
        document.querySelectorAll('.score').forEach(element => {
            element.remove();
        });
        document.querySelectorAll('.scoreBtn').forEach(element => {
            element.remove();
        });
        setUpTitleScreen();
    });
}

//on load retrieve local storage scores
window.addEventListener('load', function () {
    viewScoresBtnEl = document.querySelector('#view-scores');
    timerEl = document.querySelector('#timer');
    contentHeaderEl = document.querySelector('#content-head');
    contentBodyEl = document.querySelector('#content-body');
    contenFooterEl = document.querySelector('#content-foot');
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