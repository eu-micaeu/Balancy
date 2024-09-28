import { createFood } from '../../functions/createFood.mjs';
import { loadMenu } from '../../functions/loadMenu.mjs';
import { closeOverlay } from '../../functions/closeOverlay.mjs';

document.addEventListener("DOMContentLoaded", function () {

    var popUpCreateFood = document.createElement('div');

    popUpCreateFood.id = 'popUpCreateFood';

    popUpCreateFood.className = 'popUpCreate';

    popUpCreateFood.innerHTML = `

        <form>

            <label for="foodName">Food Name:</label>

            <input type="text" id="foodName" name="foodName" required>

            <label for="foodCal">Calories ( kCal's ):</label>

            <input type="number" id="calories" name="calories" required>

            <label for="foodQuantity">Quantity ( g's ):</label>

            <input type="number" id="quantity" name="quantity" required>

            <button type="button" id="btCreateFoodConfirm">Create</button>

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
