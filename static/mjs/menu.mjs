import { divOverlay } from './functions/divOverlay.mjs';
import { btBack } from './functions/btBack.mjs';
import { btCreate } from './functions/btCreate.mjs';
import { btCreateMealConfirm } from './functions/btCreateMealConfirm.mjs';
import { attMeals } from './functions/attMeals.mjs';

// Função DOMContentLoaded
document.addEventListener("DOMContentLoaded", function () {

    // Atualizar refeições
    attMeals();

});

// Div Overlay
divOverlay();

// Botão de voltar
btBack();

// Botão de criar refeição
btCreate();

// Botão de criar refeição confirmar
btCreateMealConfirm();