let currentDeg = 0;
// TODO: decide on a pallet
const colorPallets = [
  ['#cdb4db', '#ffc8dd', '#ffafcc', '#bde0fe', '#a2d2ff'],
  ['#003049', '#d62828', '#f77f00', '#fcbf49', '#eae2b7']
];
const colors = colorPallets[0];
let selectedIndex;

const wheel = document.getElementById('wheel');
const spinBtn = document.getElementById('spin-button');
const resultTextTitle = document.getElementById('result-text-title');
const resultTextIngredients = document.getElementById('result-text-ingredients');
const resultTextSteps = document.getElementById('result-text-steps');
const resultTextExtras = document.getElementById('result-text-extras');
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
      nameDiv.textContent = item.shortTitle || item.title;
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
  currentDeg += Math.random() * 360 + 360 * 8;
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

    resultTextTitle.textContent = selected.title;
    if (selected.ingredients) { resultTextIngredients.innerHTML = '<br>Ingredients<br>' + selected.ingredients.join('<br>'); }
    else { resultTextIngredients.innerHtml = ''; }
    if (selected.steps) { resultTextSteps.innerHTML = '<br>Steps<br>' + selected.steps.join('<br>'); }
    else { resultTextSteps.innerHTML = ''; }
    if (selected.extras) { resultTextExtras.innerHTML = '<br>Extras<br>' + selected.extras.join('<br>'); }
    else { resultTextExtras.innerHTML = '' }

    openModal('result-modal');
  }, 8000);
}

function onSaveInputs() {
  const inputData = inputDataEl.value.trim();
  if (inputData) {
    items = inputData.split('\n').filter(item => item.trim()).map(item => ({ title: item.trim() }));
    if (items.length >= 1) {
      closeModal('edit-inputs-modal');
      init();
    }
  }
}

function openEditInputsModal() {
  inputDataEl.value = items.map(item => item.title).join('\n');
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

items = [
  {
    shortTitle: "borg pasta",
    title: "borg pasta (chicken noodle soup)",
    ingredients:
      ["a stick or two of celery, diced",
        "one carrot, diced",
        "half onion, diced",
        "chicken broth: 3.5 cups water per 1 tsp bouillon",
        "chicken, diced (can buy pre-cooked)",
        "egg noodles",
        "spices: thyme and white pepper"
      ],
    steps:
      ["cook celery, carrot, and onion in chicken broth",
        "add chicken and noodles after giving the vegetables a head start (idk like 10 mins)",
        "cook until pasta is done, add spices at some point"
      ],
    extras:
      ["mix up the vegetables: napa cabbage, zucchini, etc.",
        "mix up the protein: tofu, spicy italian sausage, etc."
      ]
  },
  {
    title: "berg pasta",
    ingredients:
      ["onion, diced",
        "spicy italian sausage",
        "tomato sauce (e.g. rao's)",
        "pasta",
        "parmigiano reggiano",
        "egg noodles",
        "cayenne pepper (optional)"
      ],
    steps:
      ["saute some onions and spicy sausage, add tomato sauce when ready",
        "add cayenne whenever",
        "cook pasta and combine",
        "serve with grated cheese"
      ]
  },
  {
    title: "cold angel hair",
    ingredients:
      ["red onion",
        "soy sauce",
        "vinegar",
        "sugar",
        "garlic",
        "olive oil",
        "angel hair",
        "opt. cilantro"
      ],
    steps:
      ["sauce: sliced red onion, splash of soy sauce, splash of vinegar, 1 tbsp sugar, salt to taste",
        "lightly toast minced garlic in olive oil",
        "pour everything together with cooked pasta"
      ]
  },
  {
    title: "cheese pasta soup",
    ingredients:
      ["1/2 lb ground beef",
        "1 onion, diced",
        "1 can diced tomatoes",
        "1 can sweet corn",
        "1 can water",
        "half block velveeta",
        "pasta",
      ],
    steps:
      ["brown ground beef, drain excess fat if needed, saute onions",
        "add tomatoes and corn (liquids included) , water, and cheese",
        "add cooked pasta"
      ]
  },
  {
    title: "chili lime tilapia",
    ingredients:
      ["1 tbsp chili powder",
        "1 tsp cumin (skip if using chili powder blend)",
        "1 tsp cayenne",
        "1/2 tsp black pepper",
        "1 tbsp lime juice",
        "1 tbsp olive oil",
        "2 tilapia fillets",
        "guacamole / avocado"
      ],
    steps:
      ["combine all the spices and oil",
        "rub spices onto fish",
        "400 F, 12 minutes",
        "serve with avocado"
      ]
  },
  {
    title: "ground beef w/ rice",
    ingredients:
      ["rice",
        "ground beef",
        "chicken stock/broth",
        "a comically small amount of carrots (e.g. 3 baby carrots)",
      ],
    steps:
      ["cook ground beef, drain excess fat",
        "add stock, serve with rice",
        "eat the carrots"
      ],
    extras:
      ["try ground bison a la brian shaw"]
  },
  {
    title: "golden curry",
    ingredients:
      ["chicken, diced (can buy pre-cooked)",
        "carrots",
        "onions",
        "potatoes",
        "broccoli",
        "golden curry",
        "rice"
      ],
    steps:
      ["cook everything in boiling water",
        "add golden curry",
        "serve with rice"
      ],
    extras: ["mix up the vegetables"]
  },
  {
    title: "borg stir fry",
    ingredients:
      ["celery",
        "carrots",
        "onion",
        "protein (e.g. chicken, seitan, tofu, eggs)",
        "soy sauce or oyster sauce or whatever",
        "chili oil",
        "rice"
      ],
    steps:
      ["saute celery, carrots, onion; steam with a bit of water if needed",
        "add protein",
        "add sauce",
        "serve with rice and chili oil"
      ],
    extras: ["mix up the vegetables"]
  },
  {
    title: "kimchi pork ribs",
    ingredients:
      ["half rack pork ribs (preferably small)",
        "1 (500g) package whole cabbage kimchi, stem removed and cut into chunky squares",
        "approx 1/2 cup kimchi liquid (just use everything in the package",
        "1 onion, cut into big chunks",
        "approx 1 cup water",
        "couple tbsp soy sauce",
        "couple tbsp sugar",
        "rice"
      ],
    steps:
      ["boil ribs for around 5 minutes to get rid of gunk and drain",
        "add everything to a pot and cook for about an hour or whatever",
        "serve with rice"
      ]
  },
  {
    shortTitle: "angel hair",
    title: "angel hair with cherry tomato sauce",
    ingredients:
      ["cherry tomatoes",
        "garlic, minced",
        "marinated chicken",
        "red pepper flakes",
        "angel hair",
        "parmigiano reggiano",
        "basil leaves"
      ],
    steps:
      ["prepare protein: heat up pre-cooked or cook as instructed",
        "sautee cherry tomatoes until they're starting to burst",
        "add minced garlic and red pepper flakes",
        "mash the tomatoes",
        "on the side, cook angel hair",
        "add whatever liquid to the sauce: wine, chicken stock, pasta water, tap water is fine",
        "finish cooking pasta in the sauce, grate in parmigiano to taste, serve with chicken"
      ],
    extras: ["try with ground spicy italian sausage"]
  },
  {
    shortTitle: "orzo",
    title: "orzo with chicken cream sauce",
    ingredients:
      ["16 oz italian sausage, ground",
        "half onion, diced",
        "3-4 cloves garlic, minced",
        "red pepper flakes",
        "1 cup (uncooked) orzo",
        "2 cups chicken broth",
        "(opt) heavy cream",
        "1/2 cup parmigiano reggiano",
        "spinach"
      ],
    steps:
      ["saute sausage for a couple minutes",
        "add onions and cook for some more minutes",
        "add minced garlic, red pepper flakes, orzo, and cook for 30 seconds",
        "stir in chicken broth and cream. usually no cream cuz that's so unhealthy.",
        "cook 10 minutes/until done, stirring frequently",
        "turn off the heat and add parmigiano and spinach"
      ]
  },
  {
    title: "beef pepper rice",
    ingredients:
      ["10 oz thinly sliced beef (hot pot eye round works well)",
        "half onion, thinly sliced",
        "3 cups rice, cooked",
        "1 can sweet corn, unsalted, drained",
        "mozzarella cheese",
        "3 tbsp soy sauce",
        "1/2 tbsp oyster sauce",
        "2.5 tbsp honey",
        "2 cloves garlic, minced/grated",
        "1/4 tsp ginger, grated",
        "1/4 tsp black pepper, or to taste"
      ],
    steps:
      ["saute onions until translucent",
        "make room in pan and add beef slices, cook for a couple minutes",
        "add rice, corn, and optionally a knob of butter. add the sauce and mix.",
        "sprinkle cheese on top"
      ]
  },
  {
    title: "kimchi jjigae",
    ingredients:
      ["kimchi, along with some if its liquid",
        "pork belly, sliced",
        "onion, sliced",
        "any stock or water",
        "sugar",
        "soy sauce",
        "sesame oil",
        "garlic, minced",
        "tofu, sliced",
        "rice"
      ],
    steps:
      ["fry kimchi in sesame oil in a small pan",
        "in main pan, saute onions for a couple minutes",
        "add everything to the pot and simmer for like 20 mins or so",
        "serve with rice"
      ]
  },
  {
    title: "sushi",
    ingredients:
      ["sushi seaweed",
        "rice",
        "rice vinegar",
        "shrimp filling: shrimp, kewpie mayo, chili crisp, (opt. scallions)",
        "salmon avocado: salmon, avocado",
        "you can do whatever you want tbh"
      ],
    steps:
      ["eyeball basically everything"]
  },
];
let todo = [
  "doenjang jjigae",
  "carbonara"
];
let sides = [ "tofu and avocado", "deviled eggs", "sour spicy cold noodle"];
let longerOrBiggerRecipes = ["nyt beef stew", "baked ziti", "macaroni salad", "taiwanese beef noodle soup", "hong shao rou"];
let desserts = [ "red bean soup", "baked nian gao", "chocolate cheesecake", "chocolate lava cake"]

init();