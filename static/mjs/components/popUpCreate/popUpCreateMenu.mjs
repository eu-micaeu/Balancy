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

});
