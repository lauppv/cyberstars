```html index.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="A quiz about space, one question at a time." />
    <title>Space Quiz</title>
    <link rel="stylesheet" href="style.css" />
    <script src="quiz.js" defer></script>
  </head>
  <body>
    <main>
      <h1>Space Quiz</h1>
      <p id="quiz-status" aria-live="polite">Loading the questions...</p>
      <h2 id="question"></h2>
      <div id="answers"></div>
      <p id="feedback" aria-live="polite"></p>
      <button type="button" id="next">Next</button>
    </main>
  </body>
</html>
```

```css style.css
body {
  margin: 0;
  background-color: #0b1d3a;
  color: #f0f4ff;
  font-family: Verdana, Geneva, sans-serif;
}

main {
  max-width: 600px;
  margin: 0 auto;
  padding: 24px 16px;
}

h1 {
  color: #ffd166;
}

#answers {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

#answers button,
#next {
  padding: 12px 16px;
  border: 2px solid #8ecbff;
  border-radius: 8px;
  background-color: #13294f;
  color: #f0f4ff;
  font-size: 1rem;
  text-align: left;
}

#answers button:disabled {
  opacity: 0.7;
}

#next {
  margin-top: 16px;
  background-color: #ffd166;
  color: #0b1d3a;
}
```

```js quiz.js
const quizStatus = document.querySelector("#quiz-status");
const questionText = document.querySelector("#question");
const answerBox = document.querySelector("#answers");
const feedback = document.querySelector("#feedback");
const nextButton = document.querySelector("#next");

let questions = [];
let current = 0;
let score = 0;

function showQuestion() {
  const { question, answers } = questions[current];
  quizStatus.textContent = `Question ${current + 1} of ${questions.length}`;
  questionText.textContent = question;
  feedback.textContent = "";
  answerBox.innerHTML = "";
  answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = answer;
    button.addEventListener("click", () => choose(index));
    answerBox.append(button);
  });
}

function choose(index) {
  const { answers, correct } = questions[current];
  if (index === correct) {
    score++;
    feedback.textContent = "Right!";
  } else {
    feedback.textContent = `Not quite: the answer is ${answers[correct]}`;
  }
  for (const button of answerBox.querySelectorAll("button")) {
    button.disabled = true;
  }
  nextButton.hidden = false;
}

function showScore() {
  quizStatus.textContent = `You got ${score} of ${questions.length} right`;
  questionText.hidden = true;
  answerBox.innerHTML = "";
  feedback.textContent = "";
  nextButton.hidden = true;
}

nextButton.addEventListener("click", () => {
  current++;
  if (current < questions.length) {
    showQuestion();
  } else {
    showScore();
  }
});

async function loadQuestions() {
  try {
    const response = await fetch("questions.json");
    if (!response.ok) {
      throw new Error(`The quiz answered ${response.status}`);
    }
    questions = await response.json();
    showQuestion();
  } catch (error) {
    quizStatus.textContent = `Couldn't load the questions: ${error.message}`;
  }
}

loadQuestions();
```

```json questions.json
[
  {
    "question": "Which planet is the closest to the Sun?",
    "answers": [
      "Venus",
      "Mercury",
      "Mars"
    ],
    "correct": 1
  },
  {
    "question": "What do astronauts call the place where they live in orbit?",
    "answers": [
      "A station",
      "A harbor",
      "A tower"
    ],
    "correct": 0
  },
  {
    "question": "How long does light from the Sun take to reach Earth?",
    "answers": [
      "About 8 seconds",
      "About 8 minutes",
      "About 8 hours"
    ],
    "correct": 1
  },
  {
    "question": "Which planet has the biggest rings?",
    "answers": [
      "Saturn",
      "Jupiter",
      "Neptune",
      "Earth"
    ],
    "correct": 0
  }
]
```
