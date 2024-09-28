document.addEventListener("DOMContentLoaded", function () {

    var header = document.createElement('header');

    header.innerHTML = `

        <img src="../static/img/logo.png" alt="logo" id="logo" width="75" height="75">

        <nav>

            <button id="btPerfil" type="button" onclick="window.location.href='/perfil'">Perfil</button>

            <button id="btLogout" type="button">Logout</button>

        </nav>

    `;

    document.body.prepend(header);

});
