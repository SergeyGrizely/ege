const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Путь до tasks.json
const tasksFilePath = path.join(__dirname, 'tasks.json');

// Обработка статичных файлов (для браузера)
app.use(express.static(path.join(__dirname, 'public')));

// API для получения задач
app.get('/api/tasks', (req, res) => {
  const subject = req.query.subject;

  // Проверяем, существует ли файл tasks.json
  if (fs.existsSync(tasksFilePath)) {
    const tasks = JSON.parse(fs.readFileSync(tasksFilePath, 'utf-8'));
    const filteredTasks = tasks.filter(task => task.subject === subject);
    res.json(filteredTasks);
  } else {
    res.status(404).json({ error: 'Файл с заданиями не найден' });
  }
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
