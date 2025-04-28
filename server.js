const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.static('public'));

app.get('/api/tasks', (req, res) => {
  const tasks = require('./tasks.json');
  res.json(tasks);
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});