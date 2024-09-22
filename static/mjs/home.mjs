import { getCookie } from './getCookie.mjs';

document.getElementById("divOverlay").addEventListener("click", function() {

    var divOverlay = document.getElementById("divOverlay");

    divOverlay.style.display = "none";

    var popUpCreateMenu = document.getElementById("popUpCreateMenu");

    popUpCreateMenu.style.display = "none";

});

document.getElementById("btCreateMenu").addEventListener("click", function() {

    var divOverlay = document.getElementById("divOverlay");
    
    divOverlay.style.display = "block";

    var popUpCreateMenu = document.getElementById("popUpCreateMenu");

    popUpCreateMenu.style.display = "flex";

});

document.getElementById('btCreateMenuConfirm').addEventListener('click', function() {

    var menuName = document.getElementById('menuName').value;

    fetch('/createMenu', {

        method: 'POST',

        headers: {

            'Content-Type': 'application/json',

            'Authorization': getCookie()

        },

        body: JSON.stringify({meun_name: menuName})

    }).then(response => {

        if (response.ok) {

            document.getElementById('divOverlay').click();

        }

    });


});