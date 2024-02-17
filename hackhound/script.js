const searchBtn = document.getElementById('search-btn');
const mealList = document.getElementById('meal');
const mealDetailsContent = document.querySelector('.meal-details-content');
const recipeCloseBtn = document.getElementById('recipe-close-btn');
import { ingredientsArray } from "../newfolder/script2";
// event listeners
searchBtn.addEventListener('click', getMealList);
mealList.addEventListener('click', getMealRecipe);
recipeCloseBtn.addEventListener('click', () => {
    mealDetailsContent.parentElement.classList.remove('showRecipe');
});

ingredientsArray.forEach(ingredient => {
  const container = document.getElementById('checkbox-container'); // Make sure this exists in your HTML
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.id = ingredient;
  checkbox.value = ingredient;
  
  const label = document.createElement('label');
  label.htmlFor = ingredient;
  label.textContent = ingredient;

  container.appendChild(checkbox);
  container.appendChild(label);
  container.appendChild(document.createElement('br')); // For spacing
});

// get meal list that matches with the ingredients
function getMealList(){
    let searchInputTxt = document.getElementById('search-input').value.trim();
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`)
    .then(response => response.json())
    .then(data => {
        let html = "";
        if(data.meals){
            data.meals.forEach(meal => {
                html += `
                    <div class = "meal-item" data-id = "${meal.idMeal}">
                        <div class = "meal-img">
                            <img src = "${meal.strMealThumb}" alt = "food">
                        </div>
                        <div class = "meal-name">
                            <h3>${meal.strMeal}</h3>
                            <a href = "#" class = "recipe-btn">Get Recipe</a>
                        </div>
                    </div>
                `;
            });
            mealList.classList.remove('notFound');
        } else{
            html = "Sorry, we didn't find any meal!";
            mealList.classList.add('notFound');
        }

        mealList.innerHTML = html;
    });
}


// get recipe of the meal
function getMealRecipe(e){
    e.preventDefault();
    if(e.target.classList.contains('recipe-btn')){
        let mealItem = e.target.parentElement.parentElement;
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
        .then(response => response.json())
        .then(data => mealRecipeModal(data.meals));
    }
}

// create a modal
function mealRecipeModal(meal) {
    console.log(meal);
    meal = meal[0];
    let ingredients = [];
    // Collect all ingredients and their measures
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients.push(`${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}`);
        } else {
            // No more ingredients available
            break;
        }
    }
    // Convert the ingredients array into a string with line breaks
    let ingredientsList = ingredients.join("<br>");
    let html = `
        <h2 class="recipe-title">${meal.strMeal}</h2>
        <p class="recipe-category">${meal.strCategory}</p>
        <div class="recipe-ingredients">
            <h3>Ingredients:</h3>
            <p>${ingredientsList}</p>
        </div>
        <div class="recipe-instruct">
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
        </div>
        <div class="recipe-meal-img">
            <img src="${meal.strMealThumb}" alt="">
        </div>
        <div class="recipe-link">
            <a href="${meal.strYoutube}" target="_blank">Watch Video</a>
        </div>
    `;
    mealDetailsContent.innerHTML = html;
    mealDetailsContent.parentElement.classList.add('showRecipe');
}
// create a modal
function mealRecipeModal(meal) {
    console.log(meal);
    meal = meal[0];
    let ingredients = [];
    // Collect all ingredients and their measures
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients.push(`${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}`);
        } else {
            // No more ingredients available
            break;
        }
    }
    // Convert the ingredients array into a string with line breaks
    let ingredientsList = ingredients.join("<br>");

    // Prepare nutritional values
    let nutritionalValues = `
        <div class="recipe-nutrition">
            <h3>Nutritional Values:</h3>
            <p>Calories: ${meal.strMeasureCalories}</p>
            <p>Protein: ${meal.strMeasureProtein}</p>
            <p>Fat: ${meal.strMeasureFat}</p>
            <p>Carbohydrates: ${meal.strMeasureCarbs}</p>
            <p>Fiber: ${meal.strMeasureFiber}</p>
            <p>Sugar: ${meal.strMeasureSugar}</p>
        </div>
    `;

    let html = `
        <h2 class="recipe-title">${meal.strMeal}</h2>
        <p class="recipe-category">${meal.strCategory}</p>
        <div class="recipe-ingredients">
            <h3>Ingredients:</h3>
            <p>${ingredientsList}</p>
        </div>
        <div class="recipe-instruct">
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
        </div>
        ${nutritionalValues}
        <div class="recipe-meal-img">
            <img src="${meal.strMealThumb}" alt="">
        </div>
        <div class="recipe-link">
            <a href="${meal.strYoutube}" target="_blank">Watch Video</a>
        </div>
    `;
    mealDetailsContent.innerHTML = html;
    mealDetailsContent.parentElement.classList.add('showRecipe');
}