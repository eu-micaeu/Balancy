import { getCookie } from './getCookie.mjs';

function attFoods() {

    var tableFoods = document.getElementById('tableFoods');

    tableFoods.innerHTML = '';

    var path = parseInt(window.location.pathname.split('/meal/')[1]);

    fetch('/listMealFoods/' + path, {

        method: 'GET',

        headers: {

            'Content-Type': 'application/json',

            'Authorization': getCookie()

        }

    }).then(response => response.ok ? response.json() : null)

    .then(data => {

        var foods = data?.foods || [];

        var divListFoods = document.getElementById('divListFoods');

        if (foods.length === 0) {

            divListFoods.style.display = 'none';

            return;

        } else {

            divListFoods.style.display = 'flex';

        }

        var tr = document.createElement('tr');

        ['Comida', 'Quantidade (g)', 'Calorias (kCal)', 'Excluir?'].forEach(text => {

            var th = document.createElement('th');

            th.innerHTML = text;

            tr.appendChild(th);
            
        });
        tableFoods.appendChild(tr);

        foods.forEach(food => {
            var tr = document.createElement('tr');

            ['food_name', 'quantity', 'calories'].forEach(key => {
                var td = document.createElement('td');
                td.innerHTML = food[key];
                tr.appendChild(td);
            });

            var deleteTd = document.createElement('td');
            var deleteButton = document.createElement('button');
            deleteButton.innerHTML = 'X';
            deleteButton.style.color = 'red';
            deleteButton.style.cursor = 'pointer';

            deleteButton.addEventListener('click', function() {
                fetch(`/deleteFood/${food.food_id}`, {
                    method: 'DELETE',
                    headers: {
                        'COnetnt-Type': 'application/json',
                        'Authorization': getCookie()
                    }
                }).then(response => {
                    if (response.ok) attFoods();
                });
            });

            deleteTd.appendChild(deleteButton);
            tr.appendChild(deleteTd);
            tableFoods.appendChild(tr);
        });

        fetch(`/calculateMealCaloriesAndQuantity/${path}`, {
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

    });
    
}

export { attFoods };
