const recipes = {
  "sobrasada-dolca": {
    name: "Sobrassada dolça",
    spices: {
      "Pebre vermell dolç": 50,
      "Pebre coent": 3,
      "Sal": 25,
      "Conservant": 2
    },
    cookTime: null
  },
  "sobrasada-coenta": {
    name: "Sobrassada coenta",
    spices: {
      "Pebre vermell dolç": 30,
      "Pebre coent": 20,
      "Sal": 25,
      "Conservant": 2
    },
    cookTime: null
  },
  "botifarrons": {
    name: "Botifarrons",
    spices: {
      "Pebre coent": 4,
      "Sal": 25,
      "Pebre bo": 7
    },
    cookTime: 20
  },
  "camaiot": {
    name: "Camaiot",
    spices: {
      "Pebre coent": 4,
      "Sal": 25,
      "Pebre bo": 7
    },
    cookTime: 180
  }
};

let currentRecipeKey = null;

const homeScreen = document.getElementById("home-screen");
const calculatorScreen = document.getElementById("calculator-screen");
const recipeTitle = document.getElementById("recipe-title");
const kgInput = document.getElementById("kgInput");
const resultsTitle = document.getElementById("results-title");
const resultsTableBody = document.querySelector("#results-table tbody");
const cookTimeP = document.getElementById("cook-time");
const backButton = document.getElementById("back-button");

function openCalculator(recipeKey) {
  currentRecipeKey = recipeKey;
  const recipe = recipes[recipeKey];

  recipeTitle.textContent = recipe.name;
  resultsTitle.textContent = `Quantitats d'espècies`;

  kgInput.value = 10;

  updateResults();

  homeScreen.classList.add("hidden");
  calculatorScreen.classList.remove("hidden");
}

function goHome() {
  calculatorScreen.classList.add("hidden");
  homeScreen.classList.remove("hidden");
  currentRecipeKey = null;
}

function updateResults() {
  if (!currentRecipeKey) return;

  const recipe = recipes[currentRecipeKey];
  const kg = parseFloat(String(kgInput.value).replace(",", "."));

  resultsTableBody.innerHTML = "";

  if (isNaN(kg) || kg <= 0) {
    cookTimeP.textContent = "";
    return;
  }

  Object.entries(recipe.spices).forEach(([name, gramsPerKg]) => {
    const totalGrams = gramsPerKg * kg;
    const row = document.createElement("tr");

    const nameCell = document.createElement("td");
    nameCell.textContent = name;

    const amountCell = document.createElement("td");
    amountCell.textContent = totalGrams.toFixed(1).replace(".", ",");

    row.appendChild(nameCell);
    row.appendChild(amountCell);
    resultsTableBody.appendChild(row);
  });

  if (recipe.cookTime && recipe.cookTime > 0) {
    cookTimeP.textContent =
      `Temps de cocció recomanat: ${recipe.cookTime} minuts aproximadament.`;
  } else {
    cookTimeP.textContent = "";
  }
}

document.querySelectorAll(".recipe-button").forEach((btn) => {
  btn.addEventListener("click", () => {
    const recipeKey = btn.getAttribute("data-recipe");
    openCalculator(recipeKey);
  });
});

backButton.addEventListener("click", goHome);
kgInput.addEventListener("input", updateResults);
