import { getCookie } from './getCookie.mjs';

// Resgatar o que tiver depois de /menu/
var path = window.location.pathname.split('/menu/')[1];

// Função DOMContentLoaded
document.addEventListener("DOMContentLoaded", function () {

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

        console.log(data);

        var meals = data.meals;

        var listMeals = document.getElementById('listMeals');

        meals.forEach(meal => {

            var li = document.createElement('li');

            li.innerHTML = meal.meal_name;

            listMeals.appendChild(li);

        });

    });

});