class Question {
  constructor(qText, qAnswer) {
    this.text = qText;
    this.answer = qAnswer;
  }
}

class QuizBrain {
  constructor(questionList) {
    this.questionNumber = 0;
    this.score = 0;
    this.questionList = questionList;
    this.currentQuestion = null;
  }

  stillHasQuestions() {
    return this.questionNumber < this.questionList.length;
  }

  nextQuestion() {
    this.currentQuestion = this.questionList[this.questionNumber];
    this.questionNumber++;
    const qText = this.decodeHTML(this.currentQuestion.question);
    return `Q.${this.questionNumber}: ${qText}`;
  }

  checkAnswer(userAnswer) {
    const correctAnswer = this.currentQuestion.correct_answer;
    if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
      this.score++;
      return true;
    }
    return false;
  }

  decodeHTML(html) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }
}

let quiz;
const scoreElement = document.getElementById("score");
const questionText = document.getElementById("question-text");
const questionBox = document.getElementById("question-box");
const trueBtn = document.getElementById("true-btn");
const falseBtn = document.getElementById("false-btn");

async function fetchQuestions() {
  try {
    const res = await fetch("https://opentdb.com/api.php?amount=20&type=boolean");
    const data = await res.json();
    quiz = new QuizBrain(data.results);
    loadNextQuestion();
  } catch (error) {
    questionText.textContent = "Failed to load questions.";
    console.error(error);
  }
}

function loadNextQuestion() {
  questionBox.style.backgroundColor = "white";
  if (quiz.stillHasQuestions()) {
    scoreElement.textContent = `Score: ${quiz.score}`;
    questionText.textContent = quiz.nextQuestion();
  } else {
    questionText.textContent = "You have reached the question limit.";
    trueBtn.disabled = true;
    falseBtn.disabled = true;
  }
}

function giveFeedback(isCorrect) {
  questionBox.style.backgroundColor = isCorrect ? "green" : "red";
  setTimeout(loadNextQuestion, 1000);
}

trueBtn.addEventListener("click", () => {
  const result = quiz.checkAnswer("True");
  giveFeedback(result);
});

falseBtn.addEventListener("click", () => {
  const result = quiz.checkAnswer("False");
  giveFeedback(result);
});

fetchQuestions();
