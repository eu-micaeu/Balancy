import { getCookie } from "./getCookie.mjs";

function attMeals() {

    var listMeals = document.getElementById('listMeals');

    listMeals.innerHTML = '';

    // Resgatar o que tiver depois de /menu/ e transformar em inteiro
    var path = parseInt(window.location.pathname.split('/menu/')[1]);

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

            var btDelete = document.createElement('button');

            btDelete.innerHTML = 'Excluir';

            btDelete.addEventListener('click', function (event) {

                event.stopPropagation();

                fetch('/deleteMeal/' + meal.meal_id, {

                    method: 'DELETE',

                    headers: {

                        'Content-Type': 'application/json',

                        'Authorization': getCookie()

                    }

                }).then(response => {

                    if (response.ok) {

                        li.remove();

                    }

                });

            });

            li.appendChild(btDelete);

            listMeals.appendChild(li);

        });

    });

    fetch('/calculateMenuCaloriesAndQuantity/' + path, {

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

        document.getElementById('totalCalories').innerHTML = data.total_calories + " kCal's";

        document.getElementById('totalQuantity').innerHTML = data.total_quantity + " g's";

    });

}

export { attMeals };