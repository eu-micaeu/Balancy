import { openOverlay } from './functions/openOverlay.mjs';
import { closeOverlay } from './functions/closeOverlay.mjs';
import { loadMenu } from './functions/loadMenu.mjs';

document.addEventListener("DOMContentLoaded", function () {

    loadMenu();

});

// Lógica de adicionar refeição
document.getElementById('btAddMeal').addEventListener('click', function () {
    
    openOverlay('popUpCreateMeal');

});


document.getElementById('divOverlay').addEventListener('click', function () {

    closeOverlay('popUpCreateMeal');

    closeOverlay('popUpCreateFood');

});