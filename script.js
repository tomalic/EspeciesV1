// Estructura pública (sense fórmules)
const recipes = {
  "sobrasada-dolca": {
    name: "Sobrassada dolça",
    spices: {
      "Sal": 0,
      "Pebre vermell dolç": 0,
      "Pebre coent": 0,
      "Conservant": 0
    },
    cookTime: null
  },
  "sobrasada-coenta": {
    name: "Sobrassada coenta",
    spices: {
      "Sal": 0,
      "Pebre vermell dolç": 0,
      "Pebre coent": 0,
      "Conservant": 0
    },
    cookTime: null
  },
  "botifarrons": {
    name: "Botifarrons",
    spices: {
      "Sal": 0,
      "Pebre bo": 0,
      "Pebre coent": 0,
      "Llavors": 0
    },
    cookTime: 0
  },
  "camaiot": {
    name: "Camaiot",
    spices: {
      "Sal": 0,
      "Pebre bo": 0,
      "Pebre coent": 0
    },
    cookTime: 0
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
    // === Configuració per embotit (opcional) ===
   const allCfg = JSON.parse(localStorage.getItem(CONFIG_KEY) || "{}");
  const cfg = allCfg[currentRecipeKey]; // IMPORTANT: sense || {}

  // Si no hi ha cap configuració guardada per aquest embotit,
  // mostra totes les espècies a 0 (en lloc dels valors base)
  let finalSpices = {};
  if (!cfg) {
    Object.keys(recipe.spices || {}).forEach((name) => {
      finalSpices[name] = 0;
    });
  } else {
    // Hi ha configuració: partim de les espècies base i apliquem overrides
    finalSpices = { ...(recipe.spices || {}) };

    Object.entries(cfg).forEach(([k, v]) => {
      if (k === "__cookTime") return;
      if (typeof v === "number" && !isNaN(v)) {
        finalSpices[k] = v; // grams per kg
      }
    });
  }

  // Temps de cocció: si hi ha config, té prioritat
    const finalCookTime =
    (cfg && typeof cfg.__cookTime === "number" && !isNaN(cfg.__cookTime) && cfg.__cookTime > 0)
      ? cfg.__cookTime
      : (cfg ? recipe.cookTime : null);


  resultsTableBody.innerHTML = "";

  if (isNaN(kg) || kg <= 0) {
    cookTimeP.textContent = "";
    return;
  }

 Object.entries(finalSpices).forEach(([name, gramsPerKg]) => {
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

    if (finalCookTime && finalCookTime > 0) {
    cookTimeP.textContent =
      `Temps de cocció recomanat: ${finalCookTime} minuts aproximadament.`;
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
const CONFIG_KEY = "matances_config_by_recipe";
const configBtn = document.getElementById("configBtn");

if (configBtn) {
  configBtn.addEventListener("click", () => {
    window.location.href = "config.html";
  });
}
