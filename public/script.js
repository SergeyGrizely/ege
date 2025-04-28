let tasks = [];
let filteredTasks = [];
let currentTask = null;
let correctCount = 0;
let incorrectCount = 0;
let timerInterval;
let timeLeft = 180; // 3 минуты
let lastFilter = 'all';

// Загрузка заданий при старте
async function loadTasks(subject) {
  try {
    const response = await fetch('/tasks.json');
    const tasks = await response.json();

    const filteredTasks = tasks.filter(task => task.subject === subject);

    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    filteredTasks.forEach(task => {
      const li = document.createElement('li');
      li.textContent = task.text;
      taskList.appendChild(li);
    });
  } catch (error) {
    console.error('Ошибка загрузки задач:', error);
  }
}


function showTaskList() {
  clearInterval(timerInterval);
  const taskListDiv = document.getElementById('task-list');
  const taskDetailDiv = document.getElementById('task-detail');
  document.getElementById('timer').textContent = '';

  taskListDiv.innerHTML = '';
  taskDetailDiv.style.display = 'none';

  filteredTasks.forEach(task => {
    const taskDiv = document.createElement('div');
    taskDiv.textContent = `[${task.subject.toUpperCase()}] ${task.topic}: ${task.question}`;
    taskDiv.onclick = () => selectTask(task);
    taskListDiv.appendChild(taskDiv);
  });
}

function filterTasks(subject) {
  lastFilter = subject;
  saveProgress();
  applyFilter();
  showTaskList();
}

function applyFilter() {
  if (lastFilter === 'all') {
    filteredTasks = tasks;
  } else {
    filteredTasks = tasks.filter(task => task.subject === lastFilter);
  }
}

function selectTask(task) {
  currentTask = task;
  document.getElementById('task-list').innerHTML = '';
  document.getElementById('task-question').textContent = task.question;
  document.getElementById('user-answer').value = '';
  document.getElementById('result').textContent = '';
  document.getElementById('task-detail').style.display = 'block';
  startTimer();
}

function checkAnswer() {
  clearInterval(timerInterval);

  const userAnswer = document.getElementById('user-answer').value.trim();
  const correctAnswer = currentTask.answer.trim();

  if (userAnswer === correctAnswer) {
    document.getElementById('result').textContent = 'Правильно!';
    document.getElementById('result').style.color = 'green';
    correctCount++;
  } else {
    document.getElementById('result').textContent = `Неверно. Правильный ответ: ${correctAnswer}`;
    document.getElementById('result').style.color = 'red';
    incorrectCount++;
  }

  updateStats();
  saveProgress();

  // Автоматический переход через 2 секунды
  setTimeout(() => {
    nextTask();
  }, 2000);
}

function nextTask() {
  const nextIndex = filteredTasks.indexOf(currentTask) + 1;
  if (nextIndex < filteredTasks.length) {
    selectTask(filteredTasks[nextIndex]);
  } else {
    alert('Вы завершили все задания в этой категории.');
    backToList();
  }
}

function backToList() {
  showTaskList();
}

function updateStats() {
  const total = correctCount + incorrectCount;
  const percent = total > 0 ? Math.round((correctCount / total) * 100) : 0;
  document.getElementById('stats').textContent =
    `Правильных: ${correctCount} | Неправильных: ${incorrectCount} | Успеваемость: ${percent}%`;
}

function startTimer() {
  clearInterval(timerInterval);
  timeLeft = 180; // 3 минуты
  updateTimerDisplay();

  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      document.getElementById('result').textContent = 'Время вышло!';
      document.getElementById('result').style.color = 'orange';
      incorrectCount++;
      updateStats();
      saveProgress();

      setTimeout(() => {
        nextTask();
      }, 2000);
    }
  }, 1000);
}

function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  document.getElementById('timer').textContent = `Оставшееся время: ${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
}

function saveProgress() {
  const progress = {
    correctCount,
    incorrectCount,
    lastFilter
  };
  localStorage.setItem('ege_prep_progress', JSON.stringify(progress));
}

function loadProgress() {
  const saved = localStorage.getItem('ege_prep_progress');
  if (saved) {
    const progress = JSON.parse(saved);
    correctCount = progress.correctCount || 0;
    incorrectCount = progress.incorrectCount || 0;
    lastFilter = progress.lastFilter || 'all';
  }
}
