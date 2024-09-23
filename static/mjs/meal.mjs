import { divOverlay } from './functions/divOverlay.mjs';
import { btBack } from './functions/btBack.mjs';
import { btCreate } from './functions/btCreate.mjs';
import { btCreateFoodConfirm } from './functions/btCreateFoodConfirm.mjs';
import { attFoods } from './functions/attFoods.mjs';

// Função DOMContentLoaded
document.addEventListener("DOMContentLoaded", function () {

    // Atualizar alimentos
    attFoods();

});

// Div Overlay
divOverlay();

// Botão de voltar
btBack();

// Botão de criar comida
btCreate();

// Botão de criar comida confirmar
btCreateFoodConfirm();