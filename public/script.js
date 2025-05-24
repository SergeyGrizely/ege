function loadTest() {
  const selector = document.getElementById('testSelector');
  const testName = selector.value;
  fetch(`/api/test?name=${testName}`)
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById('taskContainer');
      container.innerHTML = '';
      data.forEach((task, index) => {
        const div = document.createElement('div');
        div.innerHTML = `<p>${index + 1}. ${task.text}</p>` +
          task.options.map(opt =>
            `<label><input type="radio" name="q${index}" value="${opt}"> ${opt}</label><br>`
          ).join('');
        container.appendChild(div);
      });
      container.dataset.answers = JSON.stringify(data.map(t => t.answer));
    });
}

function checkAnswers() {
  const container = document.getElementById('taskContainer');
  const answers = JSON.parse(container.dataset.answers);
  let correct = 0;
  const result = [];

  answers.forEach((answer, index) => {
    const selected = document.querySelector(`input[name="q${index}"]:checked`);
    const userAnswer = selected ? selected.value : '';
    const correctness = userAnswer === answer ? '✅ Правильно' : `❌ Неправильно (Правильный ответ: ${answer})`;
    if (userAnswer === answer) correct++;
    result.push(`<p>${index + 1}. ${correctness}</p>`);
  });

  document.getElementById('resultContainer').innerHTML = result.join('');
}

function loadHelp() {
  fetch('/api/help?subject=informatics')
    .then(res => res.json())
    .then(data => {
      const help = data.map(item =>
        `<p><strong>${item.topic}:</strong> ${item.text}</p>`
      ).join('');
      document.getElementById('helpContainer').innerHTML = help;
    });
}
