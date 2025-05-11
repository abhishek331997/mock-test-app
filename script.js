let currentQuestion = 0;
let score = 0;
let selectedQuestions = [];

function populateFilters() {
  const subjects = [...new Set(allQuestions.map(q => q.subject))].sort();
  const subjectDropdown = document.getElementById("subjectFilter");
  subjects.forEach(subject => {
    const opt = document.createElement("option");
    opt.value = subject;
    opt.textContent = subject;
    subjectDropdown.appendChild(opt);
  });
}

function updateTopicOptions() {
  const selectedSubject = document.getElementById("subjectFilter").value;
  const topicDropdown = document.getElementById("topicFilter");
  topicDropdown.innerHTML = '<option value="">-- Select Topic --</option>';
  const relevantTopics = [...new Set(allQuestions
    .filter(q => q.subject === selectedSubject)
    .map(q => q.topic))].sort();
  relevantTopics.forEach(topic => {
    const opt = document.createElement("option");
    opt.value = topic;
    opt.textContent = topic;
    topicDropdown.appendChild(opt);
  });
}

function startFilteredQuiz() {
  const subject = document.getElementById("subjectFilter").value;
  const topic = document.getElementById("topicFilter").value;
  selectedQuestions = allQuestions.filter(q =>
    (!subject || q.subject === subject) &&
    (!topic || q.topic === topic)
  );
  startQuiz();
}

function startRandomQuiz() {
  selectedQuestions = [...random200Set];
  startQuiz();
}

function startQuiz() {
  if (selectedQuestions.length === 0) {
    alert("No questions found.");
    return;
  }
  selectedQuestions.sort(() => Math.random() - 0.5);
  score = 0;
  currentQuestion = 0;
  document.getElementById("quizSection").style.display = "block";
  document.getElementById("result").style.display = "none";
  document.getElementById("score").textContent = "Score: 0";
  loadQuestion();
}

function loadQuestion() {
  const q = selectedQuestions[currentQuestion];
  document.getElementById("explanation").textContent = "";
  document.getElementById("nextBtn").style.display = "none";
  document.getElementById("question").textContent = `(${currentQuestion + 1}) ${q.question}`;
  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";
  q.options.forEach(optionText => {
    const div = document.createElement("div");
    div.className = "option";
    div.textContent = optionText;
    div.onclick = () => checkAnswer(div, q.correctAnswer, q.explanation);
    optionsDiv.appendChild(div);
  });
}

function checkAnswer(selectedOption, correctAnswer, explanationText) {
  const allOptions = document.querySelectorAll(".option");
  allOptions.forEach(opt => {
    opt.onclick = null;
    if (opt.textContent === correctAnswer) {
      opt.classList.add("correct");
    } else {
      opt.classList.add("wrong");
    }
  });
  if (selectedOption.textContent === correctAnswer) {
    score++;
  }
  document.getElementById("score").textContent = "Score: " + score;
  document.getElementById("explanation").textContent = explanationText;
  document.getElementById("nextBtn").style.display = "inline-block";
}

function loadNextQuestion() {
  currentQuestion++;
  if (currentQuestion < selectedQuestions.length) {
    loadQuestion();
  } else {
    document.getElementById("quizSection").style.display = "none";
    document.getElementById("result").style.display = "block";
    document.getElementById("result").textContent = `🎉 You scored ${score} out of ${selectedQuestions.length}!`;
  }
}

window.onload = populateFilters;
