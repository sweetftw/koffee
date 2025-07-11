import { ToastSystem } from "./components/toast.js";

const Toast = new ToastSystem();

let ingredients = [];
const selectedIngredients = [];
let totalRecipe = 0;

const especialCoffeeList = [
  {
    name: "Macchiato",
    recipe: ["Expresso", "Leite", "Espuma"],
  },
  {
    name: "Latte",
    recipe: ["Expresso", "Leite"],
  },
  {
    name: "Mocha",
    recipe: ["Expresso", "Leite", "Chocolate"],
  },
  {
    name: "Affogato",
    recipe: ["Sorvete", "Expresso"],
  },
];

document.addEventListener("DOMContentLoaded", () => {
  fetch("http://localhost:5000/api/v1/ingredients")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      ingredients = data;
      selectionIngredient();
      eventListener();
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
});

function selectionIngredient() {
  const listSelectionBase = document.getElementById(
    "list-selection-ingredients"
  );
  const listSelectionAdditional = document.getElementById(
    "list-selection-additional"
  );
  const listIngredientsBase = document.createElement("ul");
  const listIngredientsAdditional = document.createElement("ul");

  ingredients.forEach((ingredient) => {
    const liElement = document.createElement("li");
    liElement.textContent = ingredient.ingredient;
    liElement.id = ingredient.ingredient;
    liElement.setAttribute("data", JSON.stringify(ingredient));
    liElement.classList = `selectable-li`;

    if (ingredient.additional) {
      listIngredientsAdditional.appendChild(liElement);
    } else {
      listIngredientsBase.appendChild(liElement);
    }
  });

  listSelectionBase.appendChild(listIngredientsBase);
  listSelectionAdditional.appendChild(listIngredientsAdditional);
}

function eventListener() {
  const liSelectionElement = document.querySelectorAll(".selectable-li");

  liSelectionElement.forEach((li) => {
    li.addEventListener("click", function () {
      const valueData = JSON.parse(this.getAttribute("data"));
      const isAdd = selectedIngredients.find((i) => i.id == valueData.id);

      const additionalLength = selectedIngredients.filter(
        (i) => i.additional
      ).length;
      const baseLength = selectedIngredients.length - additionalLength;

      if (!isAdd) {
        if (valueData.additional) {
          if (additionalLength > 1) {
            Toast.warning("Máximo de ingredientes adicionais atingido!");
            return;
          }
        } else {
          if (baseLength > 2) {
            Toast.warning("Máximo de ingredientes base atingido!");
            return;
          }
        }

        this.classList.add("selected");
        selectedIngredients.push(valueData);
        totalRecipe += valueData.price;

        const listIngredientsRecipe = document.getElementById(
          "item-list-selection-recipe"
        );

        const liElement = document.createElement("li");
        liElement.textContent = valueData.ingredient;
        liElement.id = valueData.ingredient + "-recipe";

        const spanElement = document.createElement("span");
        spanElement.textContent = `R$ ${Number(valueData.price).toFixed(2)}`;

        liElement.appendChild(spanElement);

        liElement.classList.add("item-list-selection-recipe");
        listIngredientsRecipe.appendChild(liElement);
      } else {
        const index = selectedIngredients.findIndex(
          (i) => i.id == valueData.id
        );
        if (index > -1) {
          this.classList.remove("selected");
          selectedIngredients.splice(index, 1);
          totalRecipe -= valueData.price;
          document.getElementById(valueData.ingredient + "-recipe").remove();
        }
      }

      const totalElement = document.getElementById("list-selection-total");
      totalElement.textContent = `R$ ${Number(totalRecipe).toFixed(2)}`;

      if (!valueData.additional) {
        verifyEspecialRecipe();
      }

      buildCoffeeName();
    });
  });

  document
    .getElementById("ingredients-recipe-button-clean")
    .addEventListener("click", () => clearRecipe());

  document
    .getElementById("ingredients-recipe-button-submit")
    .addEventListener("click", () => submitRecipe());
}

function clearRecipe() {
  selectedIngredients.forEach((i) => {
    document.getElementById(i.ingredient).classList.remove("selected");
    document.getElementById(i.ingredient + "-recipe").remove();
  });

  totalRecipe = 0;

  document.getElementById("coffee-name").textContent = "";
  document.getElementById("especial-coffee-name").textContent = "";
  document.getElementById("list-selection-total").textContent = `R$ ${Number(
    totalRecipe
  ).toFixed(2)}`;
  selectedIngredients.splice(0, selectedIngredients.length);
}

function submitRecipe() {
  const baseLength = selectedIngredients.filter((i) => !i.additional).length;

  if (baseLength == 0) {
    Toast.error("Mínimo 1 ingrediente base deve ser selecionado");
  }

  fetch("http://localhost:5000/api/v1/order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(selectedIngredients),
  })
    .then((response) => {
      const responseJson = response.json();
      if (!response.ok) {
        throw responseJson;
      }
      return responseJson;
    })
    .then((result) => {
      Toast.info(result.message);
      clearRecipe();
    })
    .catch((error) => {
      error.then((res) => Toast.warning(res.error));
    });
}

function verifyEspecialRecipe() {
  const ingredientNames = selectedIngredients
    .filter((i) => !i.additional)
    .map((i) => i.ingredient)
    .sort();

  const especialCoffeeName = document.getElementById("especial-coffee-name");

  const especial = especialCoffeeList.find((coffee) => {
    const recipeSorted = [...coffee.recipe].sort();

    return (
      recipeSorted.length === ingredientNames.length &&
      recipeSorted.every((ing, idx) => ing === ingredientNames[idx])
    );
  });

  if (especial) {
    Toast.info("Café especial criado: " + especial.name);
    especialCoffeeName.textContent = `${especial.name} Especial:`;
  } else {
    especialCoffeeName.textContent = `Café Personalizado:`;
  }
}

function buildCoffeeName() {
  let coffeeName = "";
  selectedIngredients.forEach((item, index) => {
    index == 0
      ? (coffeeName += `${item.ingredient}`)
      : index == 1
      ? (coffeeName += ` com ${item.ingredient}`)
      : (coffeeName += `, ${item.ingredient}`);
  });

  document.getElementById("coffee-name").textContent = coffeeName;
}
