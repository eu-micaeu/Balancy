import { getCookie } from './functions/getCookie.mjs';
import { divOverlay } from './functions/divOverlay.mjs';
import { btCreate } from './functions/btCreate.mjs';
import { btCreateMenuConfirm } from './functions/btCreateMenuConfirm.mjs';

document.addEventListener("DOMContentLoaded", function () {

    fetch('/listUserMenus', {

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

        var menus = data.menus;

        var listMenus = document.getElementById('listMenus');

        menus.forEach(menu => {

            var li = document.createElement('li');

            li.innerHTML = menu.menu_name;

            li.addEventListener('click', function () {

                window.location.href = '/menu/' + menu.menu_id;

            });

            listMenus.appendChild(li);

        });

    });

});


// Div Overlay
divOverlay();

// Botão de criar menu
btCreate();

// Botão de confirmar criação de menu
btCreateMenuConfirm();
