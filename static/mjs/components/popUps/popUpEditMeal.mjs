import { closeOverlay } from "../../functions/closeOverlay.mjs";

document.addEventListener("DOMContentLoaded", function () {

    var popUpEditMeal = document.createElement('div');

    popUpEditMeal.id = 'popUpEditMeal';

    popUpEditMeal.className = 'popUps';

    document.body.appendChild(popUpEditMeal);

    document.getElementById('divOverlay').addEventListener('click', function () {

        closeOverlay('popUpEditMeal');

    })
   
});
