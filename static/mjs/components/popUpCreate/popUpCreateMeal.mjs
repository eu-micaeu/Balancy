import { createMeal } from '../../functions/createMeal.mjs';
import { loadMenu } from '../../functions/loadMenu.mjs';
import { closeOverlay } from '../../functions/closeOverlay.mjs';

document.addEventListener("DOMContentLoaded", function () {

    var popUpCreateMeal = document.createElement('div');

    popUpCreateMeal.id = 'popUpCreateMeal';

    popUpCreateMeal.className = 'popUpCreate';

    popUpCreateMeal.innerHTML = `

        <form>

            <h1>Create Meal</h1>

            <div class="form-group">
                <label for="mealName">* Meal Name:</label>
                <input type="text" id="mealName" name="mealName" placeholder="Enter meal name" required>
            </div>

            <div class="form-actions">
                <button type="button" id="btCreateMealConfirm">Create Meal</button>
            </div>

            <p class="form-note">Fields with * are required.</p>

        </form>

    `;

    document.body.appendChild(popUpCreateMeal);

    document.getElementById('btCreateMealConfirm').addEventListener('click', function () {

        const mealName = document.getElementById('mealName').value;

        createMeal(mealName).then(() => {

            loadMenu();

            closeOverlay('popUpCreateMeal'); 

            document.getElementById('mealName').value = ''; 

        });

    });

});
