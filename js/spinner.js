let currentDeg = 0;
const colors = ['#ccc', '#eee', '#ff0000', '#ACF6C8'];
let items = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
let selectedIndex;

const wheel = document.getElementById('wheel');
const spinBtn = document.getElementById('spin-button');
const resultText = document.getElementById('result-text');
const removeBtn = document.getElementById('remove-the-selected-btn');
const inputDataEl = document.getElementById('input-data');

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
        part.style.transform = `rotate(${i * degPerPart + 90}deg)`;
      } else {
        // Calculate the height of the triangle segment
        const height = Math.tan((degPerPart / 2) * Math.PI / 180) * 100;
        part.style.height = `${height}%`;
        part.style.transform = `translateY(-50%) rotate(${i * degPerPart + 90}deg)`;
        part.style.clipPath = 'polygon(0 0, 0 100%, 100% 50%)';
        part.style.top = '50%';
      }
      
      wheel.appendChild(part);
    });
  }
}

function getSelected(deg) {
  const degPerPart = 360 / items.length;
  const normalizedDeg = deg % 360;
  // we SUBTRACT normalizedDeg because spinning our wheel clockwise corresponds to
  // moving our pointer counterclockwise.
  const selectedDeg = (360 - normalizedDeg + degPerPart / 2) % 360;
  selectedIndex = Math.floor(selectedDeg / degPerPart);
  return items[selectedIndex];
}

function onSpin() {
  currentDeg += Math.floor(Math.random() * 360) + 360 * 5;
  wheel.style.transform = `rotate(${currentDeg}deg)`;
  spinBtn.disabled = true;

  setTimeout(() => {
    const selected = getSelected(currentDeg);
    spinBtn.disabled = false;

    if (items.length > 1) {
      removeBtn.style.display = 'inline-block';
    } else {
      removeBtn.style.display = 'none';
    }

    resultText.textContent = selected;
    openModal('result-modal');
  }, 3000);
}

function onSaveInputs() {
  const inputData = inputDataEl.value.trim();
  if (inputData) {
    items = inputData.split('\n').filter(item => item.trim());
    if (items.length >= 1) {
      closeModal('edit-inputs-modal');
      init();
    }
  }
}

function openEditInputsModal() {
  inputDataEl.value = items.join('\n');
  openModal('edit-inputs-modal');
}

function onRemoveSelected() {
  if (items.length > 1) {
    items.splice(selectedIndex, 1);
    closeModal('result-modal');
    init();
  }
}

// Event listeners
spinBtn.addEventListener('click', onSpin);
document.getElementById('edit-inputs-btn').addEventListener('click', openEditInputsModal);
document.getElementById('save-inputs-btn').addEventListener('click', onSaveInputs);
removeBtn.addEventListener('click', onRemoveSelected);

init();
