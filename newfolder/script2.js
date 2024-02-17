let ingredientsArray = [];
export {ingredientsArray};

document.addEventListener("DOMContentLoaded", function() {
    // Array to store added ingredients
    

    // Function to handle adding ingredient to the table and array
    function addIngredient() {
        // Get the ingredient input value
        var ingredientInput = document.getElementById("ingredients");
        var ingredient = ingredientInput.value.trim();

        // Get the expiry date input value
        var expiryDateInput = document.getElementById("ExpiryDate");
        var expiryDate = expiryDateInput.value;

        // Check if either ingredient or expiry date is empty
        if (ingredient === "" || expiryDate === "") {
            alert("Please enter both ingredient and expiry date.");
            return; // Stop execution if either field is empty
        }

        // Reference to the table body
        var tableBody = document.querySelector(".ingredients_list");

        // Create a new row
        var newRow = document.createElement("tr");

        // Create cells for ingredient and expiry date
        var ingredientCell = document.createElement("td");
        var expiryDateCell = document.createElement("td");

        // Set the text content of the cells
        ingredientCell.textContent = ingredient;
        expiryDateCell.textContent = expiryDate;

        // Append cells to the row
        newRow.appendChild(ingredientCell);
        newRow.appendChild(expiryDateCell);

        // Append a delete button cell to the row
        var deleteButtonCell = document.createElement("td");
        var deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("btn", "btn-danger", "delete");
        deleteButtonCell.appendChild(deleteButton);
        newRow.appendChild(deleteButtonCell);

        // Append the new row to the table body
        tableBody.appendChild(newRow);

        // Add the ingredient to the ingredientsArray
        ingredientsArray.push({
            ingredient: ingredient
        });

        // Clear input fields after adding ingredient
        ingredientInput.value = "";
        expiryDateInput.value = "";
    }

    // Add event listener to the "Add" button
    var addButton = document.querySelector("#Ingredients button");
    addButton.addEventListener("click", addIngredient);

    // Event listener for deleting ingredients
    document.querySelector(".ingredients_list").addEventListener("click", function(e) {
        var target = e.target;
        if (target.classList.contains("delete")) {
            var row = target.closest("tr");
            var index = Array.from(row.parentElement.children).indexOf(row);
            ingredientsArray.splice(index, 1); // Remove the corresponding ingredient from the array
            row.remove(); // Remove the row from the table
        }
    });
});