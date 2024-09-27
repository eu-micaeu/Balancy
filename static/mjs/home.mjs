import { divOverlay } from './functions/divOverlay.mjs';
import { btCreate } from './functions/btCreate.mjs';
import { btCreateMenuConfirm } from './functions/btCreateMenuConfirm.mjs';

document.addEventListener("DOMContentLoaded", function () {

    

});

document.getElementById('btLogout').addEventListener('click', function () {

    window.location.href = '/';

    // Deletar cookie
    document.cookie = 'token' + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';

});

// Div Overlay
divOverlay();

// Botão de criar menu
btCreate();

// Botão de confirmar criação de menu
btCreateMenuConfirm();
