const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static('public'));

app.get('/api/tasks', (req, res) => {
  const variant = req.query.variant;

  fs.readFile(path.join(__dirname, 'data', 'tasks.json'), 'utf-8', (err, data) => {
    if (err) {
      res.status(500).send('Ошибка при загрузке заданий');
      return;
    }

    const tasks = JSON.parse(data);

    if (variant === 'random') {
      // выбираем случайно 4 задания из всех вариантов
      const all = Object.values(tasks).flat();
      const shuffled = all.sort(() => 0.5 - Math.random());
      res.json(shuffled.slice(0, 8));
    } else {
      res.json(tasks[variant] || []);
    }
  });
});

app.get('/api/help', (req, res) => {
  fs.readFile(path.join(__dirname, 'data', 'help.json'), 'utf-8', (err, data) => {
    if (err) {
      res.status(500).send('Ошибка при загрузке справки');
      return;
    }

    const help = JSON.parse(data);
    res.json(help.filter(h => h.subject === 'informatics'));
  });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
