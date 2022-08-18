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
    //Untill the randomized array is equal in length to the array being randomized pick a random item from array and if it is not yet in the randomized array add it.
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
    //reset score to zero
    score = 0;
    //make sure "view scores" button is not disabled and works
    viewScoresBtnEl.removeAttribute('disabled');
    viewScoresBtnEl.addEventListener('click', displayScores);
    //Set header text
    contentHeaderEl.textContent = 'Coding Quiz!';
    //set footer text
    contenFooterEl.textContent = 'Once you hit start you will have 60 seconds to correctly answer as many questions as possible.';
    //create start button
    const startButton = document.createElement('button');
    startButton.classList.add('startBtn')
    startButton.textContent = 'Start Quiz';
    contentBodyEl.appendChild(startButton);
    startButton.addEventListener('click', startQuiz);
}
//Function to set layout for during the quiz.
function startQuiz(event) {
    const startButton = event.target;
    //Randomize the order of the question list and set it to the questionQueue global variable.
    questionQueue = arrayRandomizer(questionList);
    //clear the timer, header, and footer text
    timerEl.textContent = '';
    contentHeaderEl.textContent = '';
    contenFooterEl.textContent = '';
    //disable the display scores button during the quiz.
    viewScoresBtnEl.removeEventListener('click', displayScores);
    viewScoresBtnEl.setAttribute('disabled', '');
    //set the timer to 60 seconds using the startTimer function.
    startTimer(60);
    //Remove the start quiz button.
    startButton.removeEventListener('click', startQuiz);
    startButton.remove();
    //Set question number to one and score to zero
    questionNum = 1;
    score = 0;
    //Remove the next question in the question queue and display it using the display question button.
    displayQuestion(questionQueue.shift())
}

//Start timer fuction
function startTimer(seconds) {
    //set the setInterval instance to run every second and assign its id to a global variable so it can be accessed from anywhere.
    interval = setInterval(updateTime, 1000);
    function updateTime() {
        //update timer text on page
        timerEl.textContent = `Time: ${seconds}`;
        if (seconds <= 0) {
            //if the timer reaches 0 or less end the quiz with the quiz over function
            quizOver();
            //remove all the buttons for answering questions on the screen
            document.querySelectorAll('.answer-btn').forEach(ansButton => {
                ansButton.removeEventListener('click', answerPressed);
                ansButton.remove();
            });
        }
        else {
            //subtract one from the seconds remaining.
            seconds--;
        }
    }
}

//Function to take correct and incorrect answers and place buttons for each one on the screen //randomize the order of the buttons
function displayQuestion(questionObj) {
    //De contruct the question object to get the question and arrays of the correct and incorrect answers
    let { question = '', correctAnswers = [], wrongAnswers = [] } = questionObj;
    //put all answers both correct and incorrect into one array and then randomize their order.
    let answers = arrayRandomizer(correctAnswers.concat(wrongAnswers));
    //Set the header text to the question.
    contentHeaderEl.textContent = question;
    //Create a button for every possible answer to the question.
    for (let i = 0; i < answers.length; i++) {
        let ansButton = document.createElement('button');
        ansButton.textContent = `${i + 1}. ${answers[i]}`;
        ansButton.classList.add('answer-btn');
        //If the answer is correct give it class so that when clicked it becomes green
        if (correctAnswers.includes(answers[i])) {
            ansButton.classList.add('select-effect-success');
        }//If the answer is incorrect give it class so that when clicked it becomes red
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
    //if the button has class that makes it green on click (if the button corresponds to the correct answer) add 10 to the score
    if (btn.classList.contains('select-effect-success')) {
        score += 10;
    }
    //Set the footer text to show the score, number of correct and incorrect answers, and total number of questions answered.
    contenFooterEl.textContent = `Score: ${score}\nCorrect: ${score / 10}\nIncorrect: ${questionNum - (score / 10)}\nQuestions: ${questionNum}`;
    //remove the answer buttons from page
    document.querySelectorAll('.answer-btn').forEach(ansButton => {
        ansButton.removeEventListener('click', answerPressed);
        ansButton.remove();
    });
    //plus one to the question number count
    questionNum++;
    //if there are more quesions left in the question queue remove the next question from the queue and display it with the dispaly question button
    if (questionQueue.length > 0) {
        displayQuestion(questionQueue.shift());
    }
    else { //if there are no more questions left in the queue then end the quiz with the quiz over function.
        quizOver();
    }
}
//When out of time OR all questions answered end game function
function quizOver() {
    //create a form element containing a lable, name input text field, a skip button and a submit button.
    let formEl = document.createElement('form');
    let nameLabelEl = document.createElement('label');
    let nameInputEl = document.createElement('input');
    let divsEl = document.createElement('div');
    let submitBtnEl = document.createElement('button');
    let skipBtnEl = document.createElement('button');
    contentHeaderEl.textContent = `Your score is ${score}!\nWant to save it?`;
    questionNum = 0;
    formEl.classList.add('formItem');
    nameLabelEl.setAttribute('for', 'name');
    nameLabelEl.textContent = 'Name/Nickname:';
    nameLabelEl.classList.add('formItem');
    nameInputEl.setAttribute('id', 'name');
    nameInputEl.setAttribute('name', 'name');
    //make the text input required to submit form
    nameInputEl.setAttribute('required', '');
    nameInputEl.setAttribute('type', 'text');
    nameInputEl.setAttribute('placeholder', 'Name/Nickname');
    nameInputEl.classList.add('formItem');
    divsEl.classList.add('container', 'formItem');
    submitBtnEl.setAttribute('type', 'submit');
    submitBtnEl.textContent = 'Submit';
    //give class to make submit button green
    submitBtnEl.classList.add('success', 'formItem');
    skipBtnEl.textContent = 'Skip';
    //give class to make skip button blue
    skipBtnEl.classList.add('info', 'formItem');
    clearInterval(interval);
    timerEl.textContent = '';
    contentBodyEl.appendChild(formEl);
    formEl.appendChild(nameLabelEl);
    formEl.appendChild(nameInputEl);
    formEl.appendChild(divsEl);
    divsEl.appendChild(skipBtnEl);
    divsEl.appendChild(submitBtnEl);
    //if form is submitted then save score under the name in local storage
    formEl.addEventListener('submit', (event) => {
        event.preventDefault();
        localStorage.setItem(nameInputEl.value, score);
        //remove all the form elements from the page
        document.querySelectorAll('.formItem').forEach(element => {
            element.remove();
        });
        //go to the title/menu screen with the setUpTitleScreen function
        setUpTitleScreen();
    });
    //If the skip button is clicked
    skipBtnEl.addEventListener('click', (event) => {
        event.preventDefault();
        //remove form elements
        document.querySelectorAll('.formItem').forEach(element => {
            element.remove();
        });
        //go to the title/menu screen with the setUpTitleScreen function
        setUpTitleScreen();
    });
}

//end game function makes layout for entering score.

//function to load and display scores

function displayScores() {
    //create clear scores and back buttons
    let clearBtnEl = document.createElement('button');
    let backBtnEl = document.createElement('button');
    let scoreArray = [];
    //remove formatting class from content element so that the scores appear in column not rows
    contentBodyEl.classList.remove('slate-section');
    //remove the start button
    document.querySelector('.startBtn').remove();
    //disable the view scores button while viewing scores.
    viewScoresBtnEl.removeEventListener('click', displayScores);
    viewScoresBtnEl.setAttribute('disabled', '');
    //set header text to "High Scores"
    contentHeaderEl.textContent = 'High Scores';
    //clear footer text
    contenFooterEl.textContent = '';
    //get all values from local storage and push them in the score array array in NAME!#!SCORE layout
    for (let i = 0; i < localStorage.length; i++) {
        scoreArray.push(`${localStorage.key(i)}!#!${localStorage.getItem(localStorage.key(i))}`);
    }
    //arrange the array in decending order of scores
    scoreArray.sort(function (a, b) { return Number(b.split('!#!')[1]) - Number(a.split('!#!')[1]) });
    //for each element add it to the page in RANK. NAME SCORE layout
    for (let i = 0; i < scoreArray.length; i++) {
        let scoreEl = document.createElement('p');
        scoreEl.classList.add('score');
        scoreEl.textContent = `${i+1}. ${scoreArray[i].split('!#!')[0]}: ${scoreArray[i].split('!#!')[1]}`;
        contentBodyEl.appendChild(scoreEl);
    }
    //give class to make the clear score button red
    clearBtnEl.classList.add('danger', 'scoreBtn');
    clearBtnEl.textContent = 'Clear Scores';
    contenFooterEl.appendChild(clearBtnEl);
    //give class to make the back button blue
    backBtnEl.classList.add('info', 'scoreBtn');
    backBtnEl.textContent = 'Back';
    contenFooterEl.appendChild(backBtnEl);
    //When the clear scores button is pressed clear the local storage and remove the scores from the page.
    clearBtnEl.addEventListener('click', function () {
        localStorage.clear();
        document.querySelectorAll('.score').forEach(element => {
            element.remove();
        });
    });
    //When the back button is pressed remove scores page elements and go to the title/menu screen with the set up title screen button
    backBtnEl.addEventListener('click', function () {
        document.querySelectorAll('.score').forEach(element => {
            element.remove();
        });
        document.querySelectorAll('.scoreBtn').forEach(element => {
            element.remove();
        });
        contentBodyEl.classList.add('slate-section');
        setUpTitleScreen();
    });
}

//on load retrieve local storage scores
window.addEventListener('load', function () {
    //on load set key elements to global variables
    viewScoresBtnEl = document.querySelector('#view-scores');
    timerEl = document.querySelector('#timer');
    contentHeaderEl = document.querySelector('#content-head');
    contentBodyEl = document.querySelector('#content-body');
    contenFooterEl = document.querySelector('#content-foot');
    //set up the title/menu screen
    setUpTitleScreen();
});

//Array of qustion objects. There is no limit to the ammount of correct and incorrect answers that can be provided.
var questionList = [
    {
        question: 'Question 1',
        correctAnswers: ['Correct'],
        wrongAnswers: ['Incorrect A', 'Incorrect B', 'Incorrect C']
    },
    {
        question: 'Question 2',
        correctAnswers: ['Correct'],
        wrongAnswers: ['Incorrect A', 'Incorrect B', 'Incorrect C']
    },
    {
        question: 'Question 3',
        correctAnswers: ['Correct A', 'Correct B'],
        wrongAnswers: ['Incorrect A', 'Incorrect B']
    },
    {
        question: 'Question 4',
        correctAnswers: ['Correct'],
        wrongAnswers: ['Incorrect A', 'Incorrect B', 'Incorrect C']
    },
    {
        question: 'Question 5',
        correctAnswers: ['Correct'],
        wrongAnswers: ['Incorrect A', 'Incorrect B', 'Incorrect C']
    }
]