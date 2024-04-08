/** @format */
("use strict");

async function loadQuizData() {
  fetch("../data/data.json")
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      return data;
    })
    .catch((err) => console.error(`Error loading the quiz data: ${err}`));

  try {
    const res = await fetch("../data/data.json");
    const data = await res.json();

    return data;
  } catch (error) {
    console.error(`Error Loading the Quiz Data: ${error}`);
  }
}

function displayQuestion({ questions, questionIndex, quizDisplayContainer }) {
  const currentQuestion = questions[questionIndex];

  const options = currentQuestion.options
    .map(
      (option, index) => `
    <label>
        <input type="radio" name="option" value="${index}"/>
        ${option}
    </label>
  `,
    )
    .join("<br>");

  quizDisplayContainer.innerHTML = `
        <div class="question">${currentQuestion.text}</div>
        <div class="options">${options}</div>
    `;
}

// TODO: Fix Show Results
function showResults({
  questions,
  quizDisplayContainer,
  resultDisplayContainer,
}) {
  const answers = quizDisplayContainer.querySelectorAll(".options");
  let score = 0;
  let quizData = loadQuizData();

  questions.forEach((question, index) => {
    const answerContainer = answers[index];
    const selector = `input[name=question${index}]:checked`;
    const userAnswer = (answerContainer.querySelector(selector) || {}).value;

    if (Number(userAnswer) === question.answer_index) {
      score++;
    }
  });

  resultDisplayContainer.innerHTML = `Your Score is ${score} out of ${quizData.quiz.questions_count}`;
}

(async function () {
  const quizContainer = document.getElementById("quiz");
  const resultContainer = document.getElementById("results");
  const submitBtn = document.getElementById("submit");
  const prevBtn = document.getElementById("previous");
  const nextBtn = document.getElementById("next");

  const data = await loadQuizData();

  const quizTitle = data.quiz.name;
  const questions = data.quiz.questions;
  const quizLength = data.quiz.questions_count;

  let currentQuestionIndex = 0;

  prevBtn.addEventListener("click", () => {
    if (currentQuestionIndex > 0) {
      currentQuestionIndex--;
      displayQuestion({
        questions: questions,
        questionIndex: currentQuestionIndex,
        quizDisplayContainer: quizContainer,
      });
    }
  });

  nextBtn.addEventListener("click", () => {
    if (currentQuestionIndex < quizLength - 1) {
      currentQuestionIndex++;
      displayQuestion({
        questions: questions,
        questionIndex: currentQuestionIndex,
        quizDisplayContainer: quizContainer,
      });
    }
  });

  submitBtn.addEventListener("click", () => {
    showResults({
      questions: questions,
      quizDisplayContainer: quizContainer,
      resultDisplayContainer: resultContainer,
    });
  });

  displayQuestion({
    questions: questions,
    questionIndex: currentQuestionIndex,
    quizDisplayContainer: quizContainer,
  });
})();
