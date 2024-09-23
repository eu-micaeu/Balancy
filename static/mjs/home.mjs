import { getCookie } from './functions/getCookie.mjs';
import { divOverlay } from './functions/divOverlay.mjs';
import { btCreate } from './functions/btCreate.mjs';

document.addEventListener("DOMContentLoaded", function () {

    // Div Overlay
    divOverlay();

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

// Botão de criar menu
btCreate();

document.getElementById('btCreateMenuConfirm').addEventListener('click', function () {

    var menuName = document.getElementById('menuName').value;

    fetch('/createMenu', {

        method: 'POST',

        headers: {

            'Content-Type': 'application/json',

            'Authorization': getCookie()

        },

        body: JSON.stringify({ meun_name: menuName })

    }).then(response => {

        if (response.ok) {

            document.getElementById('divOverlay').click();

        }

    });


});

