let currentDeg = 0;
const colors = ['#ccc', '#eee', '#ff0000', '#ACF6C8'];
let items = ['A', 'B', 'C', 'D', 'E', 'F'];
let theChoosenIndex;

const wheel = document.getElementById('wheel');
const spinBtn = document.getElementById('spin-action');
const resultText = document.getElementById('result-text');
const removeBtn = document.getElementById('remove-the-choosen-btn');
const inputDataEl = document.getElementById('input-data');

const resultModal = new bootstrap.Modal(document.getElementById('result-modal'));
const inputModal = new bootstrap.Modal(document.getElementById('input-modal'));

function init() {
  wheel.innerHTML = '';
  if (items.length >= 1) {
    const degPerPart = 360 / items.length;

    items.forEach((item, i) => {
      const part = document.createElement('div');
      part.className = 'part';
      part.style.backgroundColor = colors[i % colors.length];

      const nameDiv = document.createElement('div');
      nameDiv.className = 'name';
      nameDiv.textContent = item;
      part.appendChild(nameDiv);

      if (items.length === 1) {
        part.style.width = '100%';
        part.style.height = '100%';
      } else if (items.length === 2) {
        part.style.height = '100%';
        part.style.transform = `rotate(${i * degPerPart}deg)`;
      } else {
        part.style.height = `${Math.tan((degPerPart / 2) * Math.PI / 180) * 100}%`;
        part.style.transform = `translateY(-50%) rotate(${i * -degPerPart}deg)`;
        part.style.clipPath = 'polygon(0 0, 0 100%, 100% 50%)';
        part.style.top = '50%';
      }

      wheel.appendChild(part);
    });
  }
}

function onSpin() {
  currentDeg += Math.floor(Math.random() * 360) + 360 * 5;
  wheel.style.transform = `rotate(${currentDeg}deg)`;
  spinBtn.disabled = true;

  setTimeout(() => {
    const theChoosen = getTheChoosen(currentDeg);
    spinBtn.disabled = false;

    if (items.length > 1) {
      removeBtn.style.display = 'inline-block';
    } else {
      removeBtn.style.display = 'none';
    }

    resultText.textContent = theChoosen;
    resultModal.show();
  }, 3000);
}

function getTheChoosen(deg) {
  theChoosenIndex = (Math.ceil((deg % 360) / (360 / items.length) + 0.5) - 1) % items.length;
  return items[theChoosenIndex];
}

function onInputData() {
  const inputData = inputDataEl.value.trim();
  if (inputData) {
    items = inputData.split('\n').filter(item => item.trim());
    if (items.length >= 1) {
      inputModal.hide();
      init();
    }
  }
}

function openInputModal() {
  inputDataEl.value = items.join('\n');
  inputModal.show();
}

function onRemoveTheChoosen() {
  if (items.length > 1) {
    items.splice(theChoosenIndex, 1);
    resultModal.hide();
    init();
  }
}

// Event listeners
spinBtn.addEventListener('click', onSpin);
document.getElementById('reinit-btn').addEventListener('click', openInputModal);
document.getElementById('save-input-btn').addEventListener('click', onInputData);
removeBtn.addEventListener('click', onRemoveTheChoosen);

init();
