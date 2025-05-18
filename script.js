let questionCount = 0;

function createAnswer() {
  return `
    <div class="answer-container">
      <div class="answer-row">
        <input type="text" class="answer-text" placeholder="Nhập nội dung câu trả lời">
        <button type="button" onclick="this.closest('.answer-container').querySelector('input[type=file]').click()"> 🖼️Chèn hình ảnh</button>
        <input type="checkbox" class="answer-correct">
        <span class="hint">[Đánh dấu check nếu câu trả lời này đúng]</span>
      </div>
      <input type="file" accept="image/*" class="hidden-input" onchange="handleImage(event, this)">
      <img class="preview-img" style="display:none;" />
    </div>
  `;
}

function addQuestion() {
  questionCount++;
  const block = document.createElement('div');
  block.className = 'question-block';
  block.innerHTML = `
    <label>Câu hỏi ${questionCount}</label>
    <div class="question-row" style="display:flex; gap: 10px; align-items: center;">
      <input type="text" class="question-text" placeholder="Nhập nội dung câu hỏi" style="flex: 1;">
      <button type="button" onclick="this.closest('.question-block').querySelector('.question-img-input').click()">🖼️Chèn hình ảnh</button>
    </div>
    <input type="file" accept="image/*" class="question-img-input hidden-input" onchange="handleImage(event, this)">
    <img class="preview-img" style="display:none;" />
    ${[1,2,3,4].map(() => createAnswer()).join('')}
  `;
  document.getElementById('container').appendChild(block);
}

function handleImage(event, input) {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = function(e) {
    const img = input.nextElementSibling;
    img.src = e.target.result;
    img.style.display = 'block';
    img.dataset.base64 = e.target.result;
  };
  if (file) reader.readAsDataURL(file);
}

function exportToHTML() {
  const title = document.querySelector('.title-input')?.value || '';
  const blocks = document.querySelectorAll('.question-block');
  const questions = [];

  blocks.forEach((block, index) => {
    const qText = block.querySelector('.question-text')?.value || '';
    const qImage = block.querySelector('.question-img-input')?.nextElementSibling?.dataset.base64 || '';
    const answers = Array.from(block.querySelectorAll('.answer-text')).map((input, i) => ({
      text: input.value,
      isCorrect: block.querySelectorAll('.answer-correct')[i].checked,
      image: block.querySelectorAll('.preview-img')[i + 1]?.dataset.base64 || ''
    }));
    if (qText) {
      for (let i = answers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [answers[i], answers[j]] = [answers[j], answers[i]];
      }
      answers.forEach((a, i) => a.letter = ['A','B','C','D'][i]);
      questions.push({ questionText: qText, questionImage: qImage, answers });
    }
  });

  const totalQuestions = questions.length;

  for (let i = questions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [questions[i], questions[j]] = [questions[j], questions[i]];
  }

  const htmlContent = `
<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8"><title>Đề kiểm tra</title>
<style>
body{font-family:Arial,sans-serif;max-width:800px;margin:30px auto;padding:0 20px;background-color:white;color:black;}
.question{margin-bottom:30px;}.answers label{display:block;margin:5px 0;}
img{max-width:100%;max-height:200px;display:block;margin-top:5px;}
.result{font-weight:bold;margin-left:10px;color:lightgreen;}.wrong{color:red;}


body {
  font-family: Arial, sans-serif;
  font-size: 20px;
  max-width: 800px;
  margin: 30px auto;
  padding: 0 20px;
  background-color: white;
  color: black;
}

h2 {
  color: red;
}

h3 {
  font-size: 22px;
  margin-bottom: 10px;
}

.answers label {
  font-size: 22px;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

input[type="radio"] {
  transform: scale(1.3);
  margin-right: 8px;
}

.score-select {
  font-size: 24px;
  padding: 6px 10px;
}

button {
  font-size: 20px;
  padding: 8px 16px;
}

#final-score {
  font-size: 22px;
  font-weight: bold;
  color: green;
}


#fixed-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: white;
  padding: 20px;
  z-index: 1000;
  border-bottom: 2px solid #ccc;
}



#fixed-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: white;
  padding: 20px;
  z-index: 1000;
  border-bottom: 2px solid #ccc;
text-align: center;
}


</style>

</head><body>

<div id="fixed-header">
  <h2 style="color: red; text-align: center;">${title}</h2>
  <div style="display: flex; justify-content: center; align-items: center; gap: 20px; flex-wrap: wrap;">

    <label style="color: blue; font-weight: bold; font-size: 30px;">Chọn thang điểm/câu:
      <select id="score-per-question" class="score-select">

  <option value="0.25">0.25</option>
  <option value="0.5">0.5</option>
  <option value="0.75">0.75</option>
  <option value="1">1</option>
  <option value="1.25">1.25</option>
  <option value="1.5">1.5</option>
  <option value="1.75">1.75</option>
  <option value="2">2</option>
  <option value="2.25">2.25</option>
  <option value="2.5">2.5</option>
  <option value="2.75">2.75</option>
  <option value="3">3</option>
  <option value="3.25">3.25</option>
  <option value="3.5">3.5</option>
  <option value="3.75">3.75</option>
  <option value="4">4</option>
  <option value="4.25">4.25</option>
  <option value="4.5">4.5</option>
  <option value="4.75">4.75</option>
  <option value="5">5</option>
  <option value="5.25">5.25</option>
  <option value="5.5">5.5</option>
  <option value="5.75">5.75</option>
  <option value="6">6</option>
  <option value="6.25">6.25</option>
  <option value="6.5">6.5</option>
  <option value="6.75">6.75</option>
  <option value="7">7</option>
  <option value="7.25">7.25</option>
  <option value="7.5">7.5</option>
  <option value="7.75">7.75</option>
  <option value="8">8</option>
  <option value="8.25">8.25</option>
  <option value="8.5">8.5</option>
  <option value="8.75">8.75</option>
  <option value="9">9</option>
  <option value="9.25">9.25</option>
  <option value="9.5">9.5</option>
  <option value="9.75">9.75</option>
  <option value="10">10</option>
</select>
  </label>
<button onclick="checkAllAnswers()" style="padding:10px 20px;font-size:16px;margin-bottom:20px; background-color: #007BFF; color: white; border: none; border-radius: 5px; cursor: pointer;">Kiểm tra kết quả</button>
  <div id="final-score" style="font-weight: bold; color: green; font-size: 30px;">Kết quả: ...</div>
</div>
</div>
<div style="height: 160px;"></div>

${questions.map((q, i) => `
  <div class="question">
    <h3>Câu ${i+1}: ${q.questionText}</h3>
    ${q.questionImage ? `<img src="${q.questionImage}">` : ''}
    <div class="answers">
      ${q.answers.map((a, j) => `
        <label>
          <input type="radio" name="q${i}" data-correct="${a.isCorrect}">
          ${a.letter}. ${a.text}
          ${a.image ? `<img src="${a.image}">` : ''}
        </label>
      `).join('')}
    </div>
    <span id="result-${i}"></span>
  </div>
`).join('')}

<script>
function checkAllAnswers(){
  const total = ${totalQuestions};
  let correctCount = 0;

  for (let i = 0; i < total; i++) {
    const radios = document.getElementsByName('q'+i);
    const selected = Array.from(radios).find(r => r.checked);
    const correct = Array.from(radios).find(r => r.dataset.correct === "true");
    const correctLetter = correct?.parentElement?.textContent.trim().charAt(0) || '?';
    const resultSpan = document.getElementById('result-'+i);
    
    if (!selected) {
      resultSpan.textContent = 'Vui lòng chọn đáp án.';
      resultSpan.className = 'wrong';
    } else if (selected.dataset.correct === "true") {
      resultSpan.innerHTML = '<strong style="color:blue;">CHÚC MỪNG BẠN</strong>';
      correctCount++;
    } else {
      resultSpan.innerHTML = '<span style="color:red;">Bạn sai rồi. Đáp án đúng là: ' + correctLetter + '</span>';
    }
  }

  // Tính điểm và hiển thị kết quả cuối
  const scorePerQuestion = parseFloat(document.getElementById('score-per-question').value);
  const finalScore = correctCount * scorePerQuestion;
  const percentage = ((correctCount / total) * 100).toFixed(2);

  document.getElementById('final-score').innerHTML = 
  '<span style="color:blue;">Kết quả:</span> Đúng ' + correctCount + '/' + total + 
  ' câu (' + percentage + '%) — <span style="color:red;">Điểm: ' + finalScore + ' Điểm</span>';



}

</script>


</script>

<!-- Nút toàn màn hình cố định -->
<div style="
  position: fixed;
  bottom: 20px;
  left: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
">
  <button onclick="openFullscreen()" style="
    padding: 10px 16px;
    font-size: 14px;
    background: #00BFFF;
    border: none;
    border-radius: 6px;
    color: white;
    cursor: pointer;
  ">🔍 Xem Full màn hình</button>

  <button onclick="exitFullscreen()" style="
    padding: 10px 16px;
    font-size: 14px;
    background: #FF6347;
    border: none;
    border-radius: 6px;
    color: white;
    cursor: pointer;
  ">❌ Thoát Full màn hình</button>
</div>

<script>
function openFullscreen() {
  const elem = document.documentElement;
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    elem.msRequestFullscreen();
  }
}

function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
}
</script>



</body></html>`;

  const blob = new Blob([htmlContent], {type: 'text/html'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'De_kiem_tra.html';
  document.body.appendChild(a);
  a.click();
  URL.revokeObjectURL(a.href);
  a.remove();
}

document.addEventListener('click', function(e) {
  if (e.target && e.target.classList.contains('insert-question-img')) {
    const container = e.target.closest('.question-block');
    const input = container.querySelector('.question-img-input');
    input.click();
  }
});

window.onload = function () {
  loadDraft();
  if (!localStorage.getItem('draftData')) addQuestion();
};

function saveDraft() {
  const title = document.querySelector('.title-input')?.value || '';
  const blocks = document.querySelectorAll('.question-block');
  const data = [];

  blocks.forEach(block => {
    const qText = block.querySelector('.question-text')?.value || '';
    const qImage = block.querySelector('.question-img-input')?.nextElementSibling?.dataset.base64 || '';
    const answers = Array.from(block.querySelectorAll('.answer-text')).map((input, i) => ({
      text: input.value,
      isCorrect: block.querySelectorAll('.answer-correct')[i].checked,
      image: block.querySelectorAll('.preview-img')[i + 1]?.dataset.base64 || ''
    }));
    if (qText) {
      data.push({ questionText: qText, questionImage: qImage, answers });
    }
  });

  localStorage.setItem('draftData', JSON.stringify({ title, questions: data }));
  alert('Đã lưu tạm dữ liệu!');
}

function resetForm() {
  if (confirm("Bạn có chắc chắn muốn xóa toàn bộ dữ liệu và bắt đầu lại?")) {
    localStorage.removeItem('draftData');
    location.reload();
  }
}

function loadDraft() {
  const draft = JSON.parse(localStorage.getItem('draftData') || '{}');
  if (!draft.questions) return;

  document.querySelector('.title-input').value = draft.title || '';
  document.getElementById('container').innerHTML = `
    <div class="question-block">
      <input type="text" class="title-input" placeholder="Nhập tiêu đề bài kiểm tra - Môn">
    </div>
  `;

  questionCount = 0;
  draft.questions.forEach(q => {
    questionCount++;
    const block = document.createElement('div');
    block.className = 'question-block';
    block.innerHTML = `
      <label>Câu hỏi ${questionCount}</label>
      <div class="question-row" style="display:flex; gap: 10px; align-items: center;">
        <input type="text" class="question-text" placeholder="Nhập nội dung câu hỏi" style="flex: 1;" value="${q.questionText}">
        <button type="button" onclick="this.closest('.question-block').querySelector('.question-img-input').click()"> 🖼️Chèn hình ảnh</button>
      </div>
      <input type="file" accept="image/*" class="question-img-input hidden-input" onchange="handleImage(event, this)">
      <img class="preview-img" style="display:${q.questionImage ? 'block' : 'none'};" src="${q.questionImage}" data-base64="${q.questionImage || ''}" />
      ${q.answers.map((a, i) => `
        <div class="answer-container">
          <div class="answer-row">
            <input type="text" class="answer-text" placeholder="Nhập nội dung câu trả lời" value="${a.text}">
            <button type="button" onclick="this.closest('.answer-container').querySelector('input[type=file]').click()">🖼️Chèn hình ảnh</button>
            <input type="checkbox" class="answer-correct" ${a.isCorrect ? 'checked' : ''}>
            <span class="hint">[Đánh dấu check nếu câu trả lời này đúng]</span>
          </div>
          <input type="file" accept="image/*" class="hidden-input" onchange="handleImage(event, this)">
          <img class="preview-img" style="display:${a.image ? 'block' : 'none'};" src="${a.image}" data-base64="${a.image || ''}" />
        </div>
      `).join('')}
    `;
    document.getElementById('container').appendChild(block);
  });
}



function importFromHTML(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const html = e.target.result;

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const title = doc.querySelector('h2')?.textContent || '';

    const questionDivs = doc.querySelectorAll('.question');
    const questions = [];

    questionDivs.forEach(qDiv => {
      const qText = qDiv.querySelector('h3')?.textContent.replace(/^Câu \d+:\s*/, '') || '';
      const qImage = qDiv.querySelector('img')?.src || '';
      const answerNodes = qDiv.querySelectorAll('.answers label');

      const answers = Array.from(answerNodes).map(label => {
        const input = label.querySelector('input');
        const text = label.textContent.trim().replace(/^[A-D]\.\s*/, '');
        const image = label.querySelector('img')?.src || '';
        const isCorrect = input?.dataset.correct === "true";
        return { text, image, isCorrect };
      });

      questions.push({ questionText: qText, questionImage: qImage, answers });
    });

    // Lưu vào localStorage và load lại
    localStorage.setItem('draftData', JSON.stringify({ title, questions }));
    alert("Đã tải đề thành công, đang nạp lại dữ liệu...");
    location.reload();
  };

  reader.readAsText(file);
}
