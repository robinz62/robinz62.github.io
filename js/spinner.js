let currentDeg = 0;
const colors = ['#ccc', '#eee', '#ff0000', '#ACF6C8'];
let items = ['A', 'B', 'C', 'D', 'E', 'F'];
let theChosenIndex;

const wheel = document.getElementById('wheel');
const spinBtn = document.getElementById('spin-action');
const resultText = document.getElementById('result-text');
const removeBtn = document.getElementById('remove-the-chosen-btn');
const inputDataEl = document.getElementById('input-data');

// const resultModal = new bootstrap.Modal(document.getElementById('result-modal'));
// const inputModal = new bootstrap.Modal(document.getElementById('input-modal'));

function openModal(id) {
  document.getElementById(id).classList.add('show');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('show');
}


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

function getTheChosen(deg) {
  const adjustedDeg = (360 - (deg % 360) + 90) % 360; // Adjust for top marker at 0°
  const degPerPart = 360 / items.length;
  theChosenIndex = Math.floor(adjustedDeg / degPerPart) % items.length;
  return items[theChosenIndex];
}

function onSpin() {
  currentDeg += Math.floor(Math.random() * 360) + 360 * 5;
  wheel.style.transform = `rotate(${currentDeg}deg)`;
  spinBtn.disabled = true;

  setTimeout(() => {
    const theChosen = getTheChosen(currentDeg);
    spinBtn.disabled = false;

    if (items.length > 1) {
      removeBtn.style.display = 'inline-block';
    } else {
      removeBtn.style.display = 'none';
    }

    resultText.textContent = theChosen;
    openModal('result-modal');
  }, 3000);
}

function onInputData() {
  const inputData = inputDataEl.value.trim();
  if (inputData) {
    items = inputData.split('\n').filter(item => item.trim());
    if (items.length >= 1) {
      closeModal('input-modal');
      init();
    }
  }
}

function openInputModal() {
  inputDataEl.value = items.join('\n');
  openModal('input-modal');
}

function onRemoveTheChosen() {
  if (items.length > 1) {
    items.splice(theChosenIndex, 1);
    closeModal('result-modal');
    init();
  }
}


// Event listeners
spinBtn.addEventListener('click', onSpin);
document.getElementById('reinit-btn').addEventListener('click', openInputModal);
document.getElementById('save-input-btn').addEventListener('click', onInputData);
removeBtn.addEventListener('click', onRemoveTheChosen);

init();
