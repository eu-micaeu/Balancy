import { getCookie } from './getCookie.mjs';

// Função DOMContentLoaded
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

        console.log(data);

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


document.getElementById("divOverlay").addEventListener("click", function () {

    var divOverlay = document.getElementById("divOverlay");

    divOverlay.style.display = "none";

    var popUpCreateMenu = document.getElementById("popUpCreateMenu");

    popUpCreateMenu.style.display = "none";

});

document.getElementById("btCreateMenu").addEventListener("click", function () {

    var divOverlay = document.getElementById("divOverlay");

    divOverlay.style.display = "block";

    var popUpCreateMenu = document.getElementById("popUpCreateMenu");

    popUpCreateMenu.style.display = "flex";

});

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

