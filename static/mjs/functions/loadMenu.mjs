import { getCookie } from './getCookie.mjs';
import { openOverlay } from './openOverlay.mjs';

// Função para buscar o menu
function fetchMenu() {
    return fetch('/menu', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': getCookie('token')
        }
    })
    .then(response => {
        if (response.status === 404) {
            throw new Error("Menu not found (404)");
        } else if (response.status === 200) {
            document.getElementById('noMenu').style.display = 'none';
            return response.json();
        } else {
            throw new Error("Unexpected response status: " + response.status);
        }
    })
    .then(data => {
        if (data && data.menu) {
            localStorage.setItem('menu_id', data.menu.menu_id);
            return data.menu;
        } else {
            throw new Error("No menu available");
        }
    })
    .catch(error => {
        console.error("Error fetching menu:", error);
        document.getElementById('yesMenu').innerHTML = '<p>No menu available at the moment. Please try again later.</p>';
    });
}


// Função para buscar refeições do menu
function fetchMenuMeals(menuId) {
    return fetch(`/listMenuMeals/${menuId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': getCookie('token')
        }
    })
    .then(response => response.json())
    .then(data => {
        if (Array.isArray(data.meals)) {
            return data.meals;
        } else {
            console.error("No meals found in the response");
            return [];
        }
    });
}

// Função para buscar o total de calorias e quantidade de um menu
function fetchMenuTotals(menuId) {
    return fetch(`/calculateMenuCaloriesAndQuantity/${menuId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': getCookie('token')
        }
    })
    .then(response => response.json())
    .then(data => {
        return {
            totalCalories: data.total_calories,
            totalQuantity: data.total_quantity
        };
    });
}

// Função para renderizar o menu na tela
function renderMenu(menu) {
    const yesMenu = document.getElementById('yesMenu');
    yesMenu.innerHTML = '';

    const h1 = document.createElement('h1');
    h1.textContent = menu.menu_name;
    yesMenu.appendChild(h1);
}

// Função para renderizar uma refeição e seus alimentos
function renderMeal(meal) {
    const yesMenu = document.getElementById('yesMenu');

    const h2 = document.createElement('h2');
    h2.textContent = meal.meal_name;
    yesMenu.appendChild(h2);

    const table = createFoodTable();
    yesMenu.appendChild(table);

    fetchMealFoods(meal.meal_id)
        .then(foods => {
            foods.forEach(food => {
                const row = createFoodRow(food);
                table.querySelector('tbody').appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching foods:', error));

    const btAddFood = createAddFoodButton(meal.meal_id);
    yesMenu.appendChild(btAddFood);
}

// Função para buscar alimentos de uma refeição
function fetchMealFoods(mealId) {
    return fetch(`/listMealFoods/${mealId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': getCookie('token')
        }
    })
    .then(response => response.json())
    .then(data => {
        if (Array.isArray(data.foods)) {
            return data.foods;
        } else {
            console.error("No foods found in the response for meal:", mealId);
            return [];
        }
    });
}

// Função para criar a tabela de alimentos
function createFoodTable() {
    const table = document.createElement('table');
    table.setAttribute('border', '1');

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    ['Alimento', "Calorias ( kCal's )", "Quantidade ( g's )"].forEach(text => {
        const th = document.createElement('th');
        th.textContent = text;
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    table.appendChild(tbody);

    return table;
}

// Função para criar uma linha na tabela de alimentos
function createFoodRow(food) {
    const row = document.createElement('tr');

    const tdFoodName = document.createElement('td');
    tdFoodName.textContent = food.food_name;
    row.appendChild(tdFoodName);

    const tdCalories = document.createElement('td');
    tdCalories.textContent = food.calories || 'N/A';
    row.appendChild(tdCalories);

    const tdQuantity = document.createElement('td');
    tdQuantity.textContent = food.quantity || 'N/A';
    row.appendChild(tdQuantity);

    return row;
}

// Função para criar o botão de adicionar alimentos
function createAddFoodButton(mealId) {
    const btAddFood = document.createElement('button');
    btAddFood.textContent = '+ Add Food';
    btAddFood.className = 'btAddFood';

    // Adiciona o evento de clique ao botão para abrir o pop-up
    btAddFood.addEventListener('click', function() {
        localStorage.setItem('meal_id', mealId);  
        openOverlay('popUpCreateFood');
    });

    return btAddFood;
}

// Função principal que carrega o menu, as refeições e calcula os totais
function loadMenu() {
    fetchMenu()
        .then(menu => {
            if (menu) {  // Verifica se o menu foi recuperado corretamente
                renderMenu(menu);
                return fetchMenuMeals(menu.menu_id);
            } else {
                throw new Error("No menu data to load meals.");
            }
        })
        .then(meals => {
            if (meals && meals.length > 0) {
                meals.forEach(meal => renderMeal(meal));
                return fetchMenuTotals(localStorage.getItem('menu_id'));
            } else {
                console.warn("No meals to render");
                document.getElementById('yesMenu').innerHTML += '<p>No meals found for this menu.</p>';
                return null; // Retorna nulo para interromper a cadeia de promessas
            }
        })
        .then(totals => {
            if (totals) { // Verifica se os totais foram recuperados corretamente
                displayMenuTotals(totals);
            }
        })
        .catch(error => console.error('Error:', error));
}

// Função para exibir os totais do menu na página
function displayMenuTotals(totals) {
    const yesMenu = document.getElementById('yesMenu');

    const totalsDiv = document.createElement('div');
    totalsDiv.innerHTML = `
        <h3>Total de Calorias do Menu: ${totals.totalCalories} kCal's</h3>
        <h3>Total de Quantidade do Menu: ${totals.totalQuantity} g's</h3>
    `;
    yesMenu.appendChild(totalsDiv);
}

export { loadMenu };
