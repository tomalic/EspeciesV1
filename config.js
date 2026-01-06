const CONFIG_KEY = "matances_config_by_recipe";

const recipeFields = {
  "sobrasada-dolca": [
    ["Sal", "Sal (g/kg)"],
    ["Pebre vermell dolç", "Pebre vermell dolç (g/kg)"],
    ["Pebre coent", "Pebre coent (g/kg)"],
    ["Conservant", "Conservant (g/kg)"]
  ],
  "sobrasada-coenta": [
    ["Sal", "Sal (g/kg)"],
    ["Pebre vermell dolç", "Pebre vermell dolç (g/kg)"],
    ["Pebre coent", "Pebre coent (g/kg)"],
    ["Conservant", "Conservant (g/kg)"]
  ],
  "botifarrons": [
    ["Sal", "Sal (g/kg)"],
    ["Pebre bo", "Pebre bo (g/kg)"],
    ["Pebre coent", "Pebre coent (g/kg)"]
  ],
  "camaiot": [
    ["Sal", "Sal (g/kg)"],
    ["Pebre bo", "Pebre bo (g/kg)"],
    ["Pebre coent", "Pebre coent (g/kg)"]
  ]
};

// DOM
const recipeSelect = document.getElementById("recipeSelect");
const fieldsContainer = document.getElementById("fieldsContainer");
const saveBtn = document.getElementById("saveConfig");
const clearBtn = document.getElementById("clearConfig");
const backBtn = document.getElementById("backConfig");

// carregar tot el bloc guardat (per receptes)
function loadAll() {
  return JSON.parse(localStorage.getItem(CONFIG_KEY) || "{}");
}

function saveAll(all) {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(all));
}

// pinta camps per la recepta seleccionada
function renderFields() {
  const key = recipeSelect.value;
  const all = loadAll();
  const savedForRecipe = all[key] || {};

  fieldsContainer.innerHTML = "";

  recipeFields[key].forEach(([spiceKey, labelText]) => {
    const label = document.createElement("label");
    label.textContent = labelText;

    const input = document.createElement("input");
    input.type = "number";
    input.step = "0.1";
    input.placeholder = "(opcional)";
    input.dataset.spiceKey = spiceKey;

    if (savedForRecipe[spiceKey] != null) {
      input.value = savedForRecipe[spiceKey];
    }

    label.appendChild(input);
    fieldsContainer.appendChild(label);
  });

  // Temps de cocció (opcional) — el posam al final per tots
  const labelCook = document.createElement("label");
  labelCook.textContent = "Temps de cocció (min)";

  const inputCook = document.createElement("input");
  inputCook.type = "number";
  inputCook.step = "1";
  inputCook.placeholder = "(opcional)";
  inputCook.dataset.cook = "1";

  if (savedForRecipe.__cookTime != null) {
    inputCook.value = savedForRecipe.__cookTime;
  }

  labelCook.appendChild(inputCook);
  fieldsContainer.appendChild(labelCook);
}

// events
recipeSelect.addEventListener("change", renderFields);

saveBtn.addEventListener("click", () => {
  const key = recipeSelect.value;
  const all = loadAll();

  const cfg = {};

  // recollir espècies
  fieldsContainer.querySelectorAll("input[data-spice-key]").forEach((inp) => {
    const v = inp.value;
    const spiceKey = inp.dataset.spiceKey;
    if (v !== "") cfg[spiceKey] = Number(v);
  });

  // recollir temps de cocció
  const cookInp = fieldsContainer.querySelector("input[data-cook='1']");
  if (cookInp && cookInp.value !== "") {
    cfg.__cookTime = Number(cookInp.value);
  }

  all[key] = cfg;
  saveAll(all);

  alert("Configuració desada");
  history.back();
});

clearBtn.addEventListener("click", () => {
  const key = recipeSelect.value;
  const all = loadAll();
  delete all[key];
  saveAll(all);

  alert("Configuració esborrada per aquest embotit");
  renderFields();
});

backBtn.addEventListener("click", () => history.back());

// init
renderFields();
