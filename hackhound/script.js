function getRecipes() {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  const selectedIngredients = Array.from(checkboxes)
    .filter(checkbox => checkbox.checked)
    .map(checkbox => checkbox.value);

  if (selectedIngredients.length === 0) {
    alert('Please select at least one star ingredient.');
    return;
  }

  const starIngredient = selectedIngredients[0]; // Choose the first selected ingredient as the star ingredient

  fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${starIngredient}`)
    .then(response => response.json())
    .then(data => {
      // Fetch additional details including nutritional information and required ingredients for each recipe
      Promise.all(data.meals.map(meal => fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`)))
        .then(responses => Promise.all(responses.map(response => response.json())))
        .then(recipes => {
          displayRecipes(recipes);
        })
        .catch(error => {
          console.error('Error fetching recipe details:', error);
        });
    })
    .catch(error => {
      console.error('Error fetching recipes:', error);
    });
}

function displayRecipes(recipes) {
  const recipeResultsDiv = document.getElementById('recipeResults');
  recipeResultsDiv.innerHTML = '';

  if (!recipes) {
    recipeResultsDiv.textContent = 'No recipes found.';
    return;
  }

  recipes.forEach(recipe => {
    const recipeElement = document.createElement('div');
    recipeElement.innerHTML = `
      <h3>${recipe.meals[0].strMeal}</h3>
      <img src="${recipe.meals[0].strMealThumb}" alt="${recipe.meals[0].strMeal}">
      <p>${recipe.meals[0].strInstructions}</p>
      <p>Category: ${recipe.meals[0].strCategory}</p>
      <p>Area: ${recipe.meals[0].strArea}</p>
      <p>Nutritional Information:</p>
      <ul>
        <li>Calories: ${recipe.meals[0].strMeasure1}</li>
        <li>Protein: ${recipe.meals[0].strMeasure2}</li>
        <!-- Add more nutritional information as needed -->
      </ul>
      <p>Required Ingredients:</p>
      <ul>
        ${getIngredientsList(recipe.meals[0])}
      </ul>
    `;
    recipeResultsDiv.appendChild(recipeElement);
  });
}

function getIngredientsList(recipe) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) { // Assuming a maximum of 20 ingredients
    const ingredient = recipe[`strIngredient${i}`];
    const measure = recipe[`strMeasure${i}`];
    if (ingredient && measure) {
      ingredients.push(`<li>${ingredient}: ${measure}</li>`);
    }
  }
  return ingredients.join('');
}
