const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Путь до tasks.json
const tasksFilePath = path.join(__dirname, 'tasks.json');

// Обработка статичных файлов (для браузера)
app.use(express.static(path.join(__dirname, 'public')));



// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
