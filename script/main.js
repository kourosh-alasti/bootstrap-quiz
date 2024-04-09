/** @format */
("use strict");

let answers = []
let currentQuestionIndex = 0;

async function loadQuizData() {
  fetch("../data/data.json")
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      data.quiz.questions.forEach(() => {
        answers.push("-1")
      })
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
        <input id="option${index}" type="radio" name="option" value="${index}"/>
        ${option}
    </label>
  `,
    )
    .join("<br>");

  quizDisplayContainer.innerHTML = `
        <div class="question">${questionIndex + 1} : ${
    currentQuestion.text
  }</div>
        <div class="options">${options}</div>
    `;

    document.getElementById("option1").addEventListener("click",() =>{
      saveAnswer()
    })
  
    document.getElementById("option2").addEventListener("click",() =>{
      saveAnswer()
    })
  
    document.getElementById("option3").addEventListener("click",() =>{
      saveAnswer()
    })
  
    document.getElementById("option0").addEventListener("click",() =>{
      saveAnswer()
    })
}

// TODO: Fix Show Results
function showResults({
  questions,
  quizDisplayContainer,
  resultDisplayContainer,
}) {
  let score = 0;
  let quizData = loadQuizData();

  questions.forEach((question, index) => {
    const userAnswer = answers[index]
    if (userAnswer === question.answer_index) {
      score++;
    }
  });

  resultDisplayContainer.innerHTML = `Your Score is ${score} out of ${questions.length}`;
}

function changeBtnState({ btnRef, isDisabled }) {
  btnRef.disabled = isDisabled;
}

function saveAnswer(){
  let answer = document.querySelector("input[name='option']:checked");
  if(answer && parseInt(answer.value) >= 0){
    answers[currentQuestionIndex] =  answer.value;
  }
}

function isFirstQuestion({ currentQuestionIndex, prevBtn, nextBtn }) {
  const isFirst = currentQuestionIndex === 0;

  if (isFirst) {
    changeBtnState({ btnRef: prevBtn, isDisabled: true });
  } else {
    changeBtnState({ btnRef: prevBtn, isDisabled: false });
  }

  changeBtnState({ btnRef: nextBtn, isDisabled: false });
}

function isLastQuestion({ currentQuestionIndex, length, prevBtn, nextBtn }) {
  const isLast = currentQuestionIndex === length - 1;

  if (isLast) {
    changeBtnState({ btnRef: nextBtn, isDisabled: true });
  } else {
    changeBtnState({ btnRef: nextBtn, isDisabled: false });
  }

  changeBtnState({ btnRef: prevBtn, isDisabled: false });
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


  isFirstQuestion({
    currentQuestionIndex: currentQuestionIndex,
    prevBtn: prevBtn,
    nextBtn: nextBtn,
  });

  prevBtn.addEventListener("click", () => {

    
    changeBtnState({ btnRef: nextBtn, isDisabled: false });

    if (currentQuestionIndex > 1) {
      currentQuestionIndex--;
      displayQuestion({
        questions: questions,
        questionIndex: currentQuestionIndex,
        quizDisplayContainer: quizContainer,
      });
    } else if (currentQuestionIndex === 1) {
      currentQuestionIndex--;
      isFirstQuestion({
        currentQuestionIndex: currentQuestionIndex,
        prevBtn: prevBtn,
        nextBtn: nextBtn,
      });

      displayQuestion({
        questions: questions,
        questionIndex: currentQuestionIndex,
        quizDisplayContainer: quizContainer,
      });
    }
    
    answer = document.querySelector(`input[id='option${answers[currentQuestionIndex]}']`);
    if(answer && parseInt(answer.value) >= 0){
      document.querySelector(`input[id='option${answers[currentQuestionIndex]}']`).checked = true;

    }

  });

  nextBtn.addEventListener("click", () => {

   
    changeBtnState({ btnRef: prevBtn, isDisabled: false });


    if (currentQuestionIndex < quizLength - 2) {
      currentQuestionIndex++;
      displayQuestion({
        questions: questions,
        questionIndex: currentQuestionIndex,
        quizDisplayContainer: quizContainer,
      });
    } else if (currentQuestionIndex === quizLength - 2) {
      currentQuestionIndex++;
      isLastQuestion({
        currentQuestionIndex: currentQuestionIndex,
        length: quizLength,
        prevBtn: prevBtn,
        nextBtn: nextBtn,
      });

      displayQuestion({
        questions: questions,
        questionIndex: currentQuestionIndex,
        quizDisplayContainer: quizContainer,
      });
    }

    

    answer = document.querySelector(`input[id='option${answers[currentQuestionIndex]}']`);
      if(answer && parseInt(answer.value) >= 0){
        document.querySelector(`input[id='option${answers[currentQuestionIndex]}']`).checked = true;

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



