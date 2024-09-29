import { createFood } from '../../functions/createFood.mjs';
import { loadMenu } from '../../functions/loadMenu.mjs';
import { closeOverlay } from '../../functions/closeOverlay.mjs';

document.addEventListener("DOMContentLoaded", function () {

    var popUpCreateFood = document.createElement('div');

    popUpCreateFood.id = 'popUpCreateFood';

    popUpCreateFood.className = 'popUpCreate';

    popUpCreateFood.innerHTML = `

            <form>

                <h1>Create Food</h1>
    
                <div class="form-group">
                    <label for="foodName">* Food Name:</label>
                    <input type="text" id="foodName" name="foodName" placeholder="Enter food name" required>
                </div>

                <div class="form-group">
                    <label for="calories">* Calories (kCal):</label>
                    <input type="number" id="calories" name="calories" placeholder="Enter calories" min="0" required>
                </div>

                <div class="form-group">
                    <label for="quantity">* Quantity (g):</label>
                    <input type="number" id="quantity" name="quantity" placeholder="Enter quantity in grams" min="0" required>
                </div>

                <div class="form-actions">
                    <button type="submit" id="btCreateFoodConfirm">Create Food</button>
                </div>

                <p class="form-note">Fields with * are required.</p>

            </form>

    `;

    document.body.appendChild(popUpCreateFood);

    document.getElementById('btCreateFoodConfirm').addEventListener('click', function () {

        const foodNameInput = document.getElementById('foodName');

        const caloriesInput = document.getElementById('calories');

        const quantityInput = document.getElementById('quantity');

        if (foodNameInput && caloriesInput && quantityInput) {

            const foodName = foodNameInput.value;

            const calories = caloriesInput.value;

            const quantity = quantityInput.value;

            const mealId = localStorage.getItem('meal_id');

            if (mealId) {

                createFood(foodName, calories, quantity, mealId).then(() => {

                    loadMenu();

                    closeOverlay('popUpCreateFood');

                    foodNameInput.value = '';

                    caloriesInput.value = '';

                    quantityInput.value = '';

                });

            } else {

                console.error('meal_id não encontrado no localStorage');
            }

        } else {

            console.error('Um ou mais campos de entrada estão ausentes.');

        }

    });

});
