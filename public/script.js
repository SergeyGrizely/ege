let currentTasks = [];
let timerInterval;
let timeLeft = 45 * 60;

function loadTest(variant) {
  clearInterval(timerInterval);
  document.getElementById('timer').textContent = '';
  document.getElementById('checkBtn').style.display = 'block';

  fetch(`/api/tasks?variant=${variant}`)
    .then(res => res.json())
    .then(tasks => {
      currentTasks = tasks;
      renderTasks(tasks);
      startTimer();
    });
  loadHelp();
}

function renderTasks(tasks) {
  const container = document.getElementById('testContainer');
  container.innerHTML = '';

  tasks.forEach((task, index) => {
    const div = document.createElement('div');
    div.className = 'task-block';
    const q = document.createElement('p');
    q.textContent = `${index + 1}. ${task.text}`;
    div.appendChild(q);

    if (task.options) {
      task.options.forEach(opt => {
        const label = document.createElement('label');
        label.innerHTML = `<input type="radio" name="q${index}" value="${opt}"> ${opt}`;
        div.appendChild(label);
      });
    } else {
      const input = document.createElement('input');
      input.type = 'text';
      input.name = `q${index}`;
      div.appendChild(input);
    }

    container.appendChild(div);
  });
}

function checkAnswers() {
  const container = document.getElementById('testContainer');
  const inputs = container.querySelectorAll('input');
  const answers = currentTasks.map(t => t.answer.trim().toLowerCase());

  currentTasks.forEach((task, i) => {
    const taskInputs = container.querySelectorAll(`[name="q${i}"]`);
    let userAnswer = '';

    if (task.options) {
      const checked = [...taskInputs].find(r => r.checked);
      userAnswer = checked ? checked.value.trim().toLowerCase() : '';
    } else {
      userAnswer = taskInputs[0].value.trim().toLowerCase();
    }

    const result = document.createElement('div');
    result.textContent = userAnswer === answers[i] ? 'Верно' : `Неверно. Правильный ответ: ${task.answer}`;
    result.className = userAnswer === answers[i] ? 'correct' : 'incorrect';
    taskInputs[task.options ? 0 : 0].parentElement.appendChild(result);
  });

  document.getElementById('checkBtn').style.display = 'none';
  clearInterval(timerInterval);
}

function startTimer() {
  timeLeft = 45 * 60;

  function updateTimer() {
    const min = Math.floor(timeLeft / 60);
    const sec = timeLeft % 60;
    document.getElementById('timer').textContent = `Осталось времени: ${min}:${sec < 10 ? '0' : ''}${sec}`;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      checkAnswers();
    } else {
      timeLeft--;
    }
  }

  updateTimer();
  timerInterval = setInterval(updateTimer, 1000);
}

function loadHelp() {
  fetch('/api/help?subject=informatics')
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById('helpContainer');
      container.innerHTML = '';
      data.forEach(h => {
        const div = document.createElement('div');
        div.innerHTML = `<strong>${h.topic}:</strong> ${h.text}`;
        container.appendChild(div);
      });
    })
    .catch(err => {
      console.error('Ошибка при загрузке справки:', err);
    });
}
