import { getCookie } from "../../functions/getCookie.mjs";
import { closeOverlay } from "../../functions/closeOverlay.mjs";

document.addEventListener("DOMContentLoaded", function () {

    var popUpCreateMenu = document.createElement('div');

    popUpCreateMenu.id = 'popUpCreateMenu';

    popUpCreateMenu.className = 'popUpCreate';

    popUpCreateMenu.innerHTML = `

        <form>

            <label for="menuName">Menu Name:</label>

            <input type="text" id="menuName" name="menuName" required>

            <button type="button" id="btCreateMenuConfirm">Create</button>

        </form>

    `;

    document.body.appendChild(popUpCreateMenu);

    document.getElementById('btCreateMenuConfirm').addEventListener('click', function () {

        var menuName = document.getElementById('menuName').value;

        fetch('/createMenu', {

            method: 'POST',

            headers: {
                'Content-Type': 'application/json',
                'Authorization': getCookie('token')
            },

            body: JSON.stringify({ menu_name: menuName })

        }).then(response => {

            if (response.ok) {

                response.json().then(data => {

                    console.log(data);

                    closeOverlay('popUpCreateMenu');

                    loadMenu();

                });

            }

        });

    });

});
