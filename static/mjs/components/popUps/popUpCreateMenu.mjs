import { createMenu } from "../../functions/createMenu.mjs";
import { loadMenu } from "../../functions/loadMenu.mjs";

document.addEventListener("DOMContentLoaded", function () {

    var popUpCreateMenu = document.createElement('div');

    popUpCreateMenu.id = 'popUpCreateMenu';

    popUpCreateMenu.className = 'popUps';

    popUpCreateMenu.innerHTML = `

        <form>

            <h1>Create Menu</h1>

            <div class="form-group">
                <label for="menuName">* Menu Name:</label>
                <input type="text" id="menuName" name="menuName" placeholder="Enter menu name" required>
            </div>

            <div class="form-actions">
                <button type="button" id="btCreateMenuConfirm">Create Menu</button>
            </div>

            <p class="form-note">Fields with * are required.</p>

        </form>

    `;

    document.body.appendChild(popUpCreateMenu);

    document.getElementById('btCreateMenuConfirm').addEventListener('click', function () {

        const menuName = document.getElementById('menuName').value;

        createMenu(menuName).then(() => {
            
            document.getElementById('menuName').value = ''; 

            loadMenu();

        });

    });
   

});
