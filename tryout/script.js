document.addEventListener('DOMContentLoaded', function() {
    const ingredients = ["Flour", "Sugar", "Eggs", "Butter"];
    const form = document.getElementById('ingredientForm');

    ingredients.forEach(ingredient => {
        const checkboxContainer = document.createElement('div');
        const checkbox = document.createElement('input');
        const label = document.createElement('label');

        checkbox.setAttribute('type', 'checkbox');
        checkbox.setAttribute('name', 'ingredients[]');
        checkbox.setAttribute('value', ingredient);
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(ingredient));

        checkboxContainer.appendChild(label);
        form.insertBefore(checkboxContainer, form.lastElementChild);
    });
});
const ingredients = ["Flour", "Sugar", "Eggs", "Butter"];
