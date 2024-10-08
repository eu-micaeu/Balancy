import { getCookie } from './getCookie.mjs';
import { openOverlay } from './openOverlay.mjs';
import { closeOverlay } from './closeOverlay.mjs';
import { fetchMenu } from './fetchMenu.mjs';

const fetchData = async (url, method = 'GET', body = null) => {
    
    const headers = {

        'Content-Type': 'application/json',

        'Authorization': getCookie('token'),

    };

    const options = {

        method,

        headers,

        body: body ? JSON.stringify(body) : null,

    };

    try {

        const response = await fetch(url, options);

        if (!response.ok) throw new Error(`Error: ${response.status}`);

        return await response.json();

    } catch (error) {

        console.error('Fetch error:', error);

        throw error;

    }

};

const renderElement = (tag, content = '', parent = null, className = '') => {

    const element = document.createElement(tag);

    element.textContent = content;

    if (className) element.className = className;

    if (parent) parent.appendChild(element);

    return element;

};

const fetchMenuMeals = async (menuId) => {

    const data = await fetchData(`/listMenuMeals/${menuId}`);

    return data.meals || [];

};

const renderMeal = (meal) => {

    const yesMenu = document.getElementById('yesMenu');

    if (!yesMenu) return console.error('Element with id "yesMenu" not found.');



    let mealHeader = document.querySelector(`[data-meal-id="${meal.meal_id}"]`);

    if (!mealHeader) {

        mealHeader = renderElement('div', '', yesMenu, 'mealHeader');

        mealHeader.setAttribute('data-meal-id', meal.meal_id);

    } else {

        mealHeader.innerHTML = '';

    }

    renderElement('h2', meal.meal_name, mealHeader)

    mealHeader.addEventListener('click', () => openMealPopup(meal.meal_id));

    const deleteButton = createIconButton('Delete Meal', 'fas fa-trash', async () => {
        await deleteMeal(meal.meal_id, mealHeader);

    });

    mealHeader.appendChild(deleteButton);

};

const createIconButton = (title, iconClass, onClick) => {

    const button = document.createElement('button');

    button.title = title;

    button.innerHTML = `<i class="${iconClass}"></i>`;

    button.className = 'deleteButton';

    button.addEventListener('click', (e) => {

        e.stopPropagation();

        onClick();

    });

    return button;

};

const deleteMeal = async (mealId, mealElement) => {

    const response = await fetchData(`/deleteMeal/${mealId}`, 'DELETE');

    console.log('Response from deleteMeal:', response);

    mealElement.remove();

};

const fetchMealFoods = async (mealId) => {

    const data = await fetchData(`/listMealFoods/${mealId}`);

    return data.foods || [];

};

const openMealPopup = async (mealId) => {

    localStorage.setItem('meal_id', mealId);

    openOverlay('popUpEditMeal');

    const popUpContent = document.getElementById('popUpEditMeal');

    if (!popUpContent) return console.error('Element with id "popUpEditMealContent" not found.');

    popUpContent.innerHTML = '';

    const foods = await fetchMealFoods(mealId);

    if (foods.length === 0) {

        renderElement('p', 'No foods available. Please add some food to your meal.', popUpContent, 'no-foods-warning');

        popUpContent.appendChild(createAddFoodButton(mealId));

        return;

    }

    const table = createFoodTable();

    foods.forEach(food => table.querySelector('tbody').appendChild(createFoodRow(food)));

    popUpContent.appendChild(table);

    popUpContent.appendChild(createAddFoodButton(mealId));

};

const createFoodTable = () => {

    const table = document.createElement('table');

    table.setAttribute('border', '1');

    const headers = ['Food', "kCal", "g"];

    const thead = table.createTHead().insertRow();

    headers.forEach(text => renderElement('th', text, thead));

    table.createTBody();

    return table;

};

const createFoodRow = (food) => {

    const row = document.createElement('tr');

    const fields = [food.food_name, food.calories || 'N/A', food.quantity || 'N/A'];

    fields.forEach(field => renderElement('td', field, row));

    const deleteButton = createIconButton('Delete Food', 'fa-solid fa-eraser', async () => {

        await deleteFood(food.food_id);

        row.remove();

    });

    row.appendChild(deleteButton);

    return row;

};

const deleteFood = async (foodId) => {

    try {

        const response = await fetchData(`/deleteFood/${foodId}`, 'DELETE');

        if (response.status === 200) {

            closeOverlay('popUpEditMeal');

        } else {
            
            console.error('Error deleting food:', response.status);

        }

    } catch (error) {

        console.error('Error deleting food:', error);

    }

};

const createAddFoodButton = (mealId) => {
    const button = renderElement('button', '+ Add Food', document.createElement('div'), 'btAddFood');
    button.addEventListener('click', () => {
        localStorage.setItem('meal_id', mealId);
        closeOverlay('popUpEditMeal');
        openOverlay('popUpCreateFood');
    });
    return button;
};

const loadMenu = async () => {

    try {
        
        const menu = await fetchMenu();

        const yesMenu = document.getElementById('yesMenu');
        yesMenu.innerHTML = '';

        renderElement('h3', menu.menu_name, yesMenu);

        const meals = await fetchMenuMeals(menu.menu_id);

        if (meals.length === 0) {

            renderElement('p', 'No meals available. Please add some food to your menu.', yesMenu, 'no-meals-warning');

        } else {

            meals.forEach(renderMeal);

        }

    } catch (error) {

        console.error('Error loading menu:', error);

    }

};


export { loadMenu };
