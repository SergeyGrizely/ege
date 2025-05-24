const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.static('public'));

app.get('/api/test', (req, res) => {
  const { name } = req.query;
  fs.readFile(path.join(__dirname, 'data', 'tasks.json'), 'utf8', (err, data) => {
    if (err) return res.status(500).send("Ошибка при загрузке тестов");
    const all = JSON.parse(data).tests;
    if (name === 'random') {
      const allTasks = Object.values(all).flat();
      const shuffled = allTasks.sort(() => 0.5 - Math.random()).slice(0, 5);
      res.json(shuffled);
    } else {
      res.json(all[name] || []);
    }
  });
});

app.get('/api/help', (req, res) => {
  const { subject } = req.query;
  fs.readFile(path.join(__dirname, 'data', 'help.json'), 'utf8', (err, data) => {
    if (err) return res.status(500).send("Ошибка при загрузке справки");
    const allHelp = JSON.parse(data);
    const filtered = allHelp.filter(item => item.subject === subject);
    res.json(filtered);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
