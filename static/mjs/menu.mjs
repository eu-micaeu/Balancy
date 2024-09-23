import { getCookie } from './functions/getCookie.mjs';
import { divOverlay } from './functions/divOverlay.mjs';
import { btBack } from './functions/btBack.mjs';
import { btCreateMeal } from './functions/btCreateMeal.mjs';

// Resgatar o que tiver depois de /menu/
var path = window.location.pathname.split('/menu/')[1];

// Função DOMContentLoaded
document.addEventListener("DOMContentLoaded", function () {

    // Div Overlay
    divOverlay();

    // Botão de voltar
    btBack();

    fetch('/listMenuMeals/' + path, {

        method: 'GET',

        headers: {

            'Content-Type': 'application/json',

            'Authorization': getCookie()

        }

    }).then(response => {

        if (response.ok) {

            return response.json();

        }

    }).then(data => {

        var meals = data.meals;

        var listMeals = document.getElementById('listMeals');

        meals.forEach(meal => {

            var li = document.createElement('li');

            li.innerHTML = meal.meal_name;

            li.addEventListener('click', function () {

                window.location.href = '/meal/' + meal.meal_id;

            });

            listMeals.appendChild(li);

        });

    });

});

// Botão de criar refeição
btCreateMeal();