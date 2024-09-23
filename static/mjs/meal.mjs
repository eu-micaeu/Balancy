import { getCookie } from './functions/getCookie.mjs';
import { divOverlay } from './functions/divOverlay.mjs';
import { btBack } from './functions/btBack.mjs';
import { btCreate } from './functions/btCreate.mjs';

// Resgatar o que tiver depois de /menu/
var path = window.location.pathname.split('/meal/')[1];

// Função DOMContentLoaded
document.addEventListener("DOMContentLoaded", function () {

    // Div Overlay
    divOverlay();

    // Botão de voltar
    btBack();

    fetch('/listMealFoods/' + path, {

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

        console.log(data);

        var foods = data.foods;

        var listFoods = document.getElementById('listFoods');

        foods.forEach(food => {

            var li = document.createElement('li');

            li.innerHTML = food.food_name + ' - ' + food.quantity + 'g' + ' - ' + food.calories + ' cal';

            listFoods.appendChild(li);

        });

    });

});

// Botão de criar comida
btCreate();