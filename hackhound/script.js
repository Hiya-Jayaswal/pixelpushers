function getRecipes() {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  const selectedIngredients = Array.from(checkboxes)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value);

  if (selectedIngredients.length === 0) {
    alert("Please select at least one star ingredient.");
    return;
  }

  const starIngredient = selectedIngredients[0]; // Choose the first selected ingredient as the star ingredient

  fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${starIngredient}`
  )
    .then((response) => response.json())
    .then((data) => {
      // Fetch additional details including nutritional information and required ingredients for each recipe
      Promise.all(
        data.meals.map((meal) =>
          fetch(
            `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`
          )
        )
      )
        .then((responses) =>
          Promise.all(responses.map((response) => response.json()))
        )
        .then((recipes) => {
          displayRecipes(recipes);
        })
        .catch((error) => {
          console.error("Error fetching recipe details:", error);
        });
    })
    .catch((error) => {
      console.error("Error fetching recipes:", error);
    });
}

function displayRecipes(recipes) {
  const recipeResultsDiv = document.getElementById("recipeResults");
  recipeResultsDiv.innerHTML = "";

  if (!recipes) {
    recipeResultsDiv.textContent = "No recipes found.";
    return;
  }

  recipes.forEach((recipe) => {
    const recipeElement = document.createElement("div");
    recipeElement.innerHTML = `
    <div style="margin-left:30rem;margin-top:10rem;margin-bottom:10rem">
    <img src="${recipe.meals[0].strMealThumb}" alt="${
      recipe.meals[0].strMeal
    }" style="width: 20.25rem; height: 12.5rem; flex-shrink: 0; border-radius: 0.75rem; background: linear-gradient(180deg, rgba(0, 0, 0, 0.00) 50%, rgba(0, 0, 0, 0.50) 100%), url('${
      recipe.meals[0].strMealThumb
    }'), lightgray 50% / cover no-repeat; box-shadow: 0px 11px 4px 0px rgba(164, 164, 164, 0.33) inset;">

    <h3 style="
    color: #000000;
    font-family: 'Inter', sans-serif;
    font-size: 1.125rem;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    text-transform: capitalize;
  ">${recipe.meals[0].strMeal}</h3>
  <p style="color: #9A9A9A;
  font-family: Inter;
  font-size: 0.75rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  text-transform: capitalize;">Category: ${recipe.meals[0].strCategory}</p>
<div style="width: 20.25rem; margin-top:1rem; margin-bottom:1rem";>
  <p style="color: #9A9A9A;
  font-family: Inter;
  font-size: 0.75rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  text-transform: capitalize;">${recipe.meals[0].strInstructions}</p>
 </div>
      <p style="margin-top:0rem; margin-bottom:.6rem">Area: ${recipe.meals[0].strArea}</p>
     
      <div style="display: flex;
      align-items: center;
      gap: 0.5rem;">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M15 11L14 20" stroke="#868686" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M19 11L15 4" stroke="#868686" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M2 11H22" stroke="#868686" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M3.5 11L5.1 18.4C5.1935 18.8586 5.44485 19.2698 5.81028 19.5621C6.17572 19.8545 6.63211 20.0094 7.1 20H16.9C17.3679 20.0094 17.8243 19.8545 18.1897 19.5621C18.5552 19.2698 18.8065 18.8586 18.9 18.4L20.6 11" stroke="#868686" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M4.5 15.5H19.5" stroke="#868686" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M5 11L9 4" stroke="#868686" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M9 11L10 20" stroke="#868686" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
      <p style="color: #868686;
      font-family: Inter;
      font-size: 1rem;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
      
      text-transform: capitalize;">Ingridents Used</p>
      </div>
      <ul>
        ${getIngredientsList(recipe.meals[0])}
      </ul>
      <p style="margin-top:1rem;">Nutritional Information:</p>
      <ul>
        <li>Calories: ${recipe.meals[0].strMeasure1}</li>
        <li>Protein: ${recipe.meals[0].strMeasure2}</li>
        <!-- Add more nutritional information as needed -->
      </ul>
      </div>
    `;
    recipeResultsDiv.appendChild(recipeElement);
  });
}

function getIngredientsList(recipe) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    // Assuming a maximum of 20 ingredients
    const ingredient = recipe[`strIngredient${i}`];
    const measure = recipe[`strMeasure${i}`];
    if (ingredient && measure) {
      ingredients.push(`<li>${ingredient}: ${measure}</li>`);
    }
  }
  return ingredients.join("");
}
