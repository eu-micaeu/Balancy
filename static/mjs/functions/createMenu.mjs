import { getCookie } from "../functions/getCookie.mjs";
import { closeOverlay } from "../functions/closeOverlay.mjs";
import { loadMenu } from "../functions/loadMenu.mjs";

function createMenu(menuName){

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

                closeOverlay('popUpCreateMenu');

                loadMenu();

            });

        }

    });

}

export { createMenu };