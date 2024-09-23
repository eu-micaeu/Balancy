import { getCookie } from './functions/getCookie.mjs';
import { divOverlay } from './functions/divOverlay.mjs';
import { btBack } from './functions/btBack.mjs';
import { btCreate } from './functions/btCreate.mjs';
import { btCreateFoodConfirm } from './functions/btCreateFoodConfirm.mjs';

// Resgatar o que tiver depois de /meal/
var path = parseInt(window.location.pathname.split('/meal/')[1]);

// Função DOMContentLoaded
document.addEventListener("DOMContentLoaded", function () {

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

        var foods = data.foods;

        var tableFoods = document.getElementById('tableFoods');

        // Cabeçalho da tabela

        var tr = document.createElement('tr');

        var th = document.createElement('th');

        th.innerHTML = 'Comida';

        tr.appendChild(th);

        var th = document.createElement('th');

        th.innerHTML = 'Quantidade (g)';

        tr.appendChild(th);

        var th = document.createElement('th');

        th.innerHTML = 'Calorias (kCal)';

        tr.appendChild(th);

        tableFoods.appendChild(tr);

        for (var i = 0; i < foods.length; i++) {

            var tr = document.createElement('tr');

            var td = document.createElement('td');

            td.innerHTML = foods[i].food_name;

            tr.appendChild(td);

            var td = document.createElement('td');

            td.innerHTML = foods[i].quantity;

            tr.appendChild(td);

            var td = document.createElement('td');

            td.innerHTML = foods[i].calories;

            tr.appendChild(td);

            tableFoods.appendChild(tr);

        }

        fetch('/calculateMealCaloriesAndQuantity/' + path, {

            method: 'GET',

            headers: {

                'Content-Type': 'application/json',

                'Authorization': getCookie()

            }

        }).then(response => {

            if (response.ok) {

                return response.json();

            }

        }

        ).then(data => {

            // Adicionar o resultado da quantidade e calorias

            var totalCalories = document.getElementById('totalCalories');

            totalCalories.innerHTML = 'Total de calorias: ' + data.total_calories;

            var totalQuantity = document.getElementById('totalQuantity');

            totalQuantity.innerHTML = 'Total de quantidade: ' + data.total_quantity;

        }

        )

    });

});

// Div Overlay
divOverlay();

// Botão de voltar
btBack();

// Botão de criar comida
btCreate();

// Botão de criar comida confirmar
btCreateFoodConfirm(path);