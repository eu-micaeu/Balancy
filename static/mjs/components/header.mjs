document.addEventListener("DOMContentLoaded", function () {

    // Se a página for /home

    if (window.location.pathname === '/home') {

        var header = document.createElement('header');

        header.innerHTML = `
    
                <img src="../static/img/logo.png" alt="logo" id="logo" width="50" height="50">
    
                <nav>
    
                    <button id="btPerfil" type="button" onclick="window.location.href='/perfil'">Perfil</button>
    
                    <button id="btLogout" type="button">Logout</button>
    
                </nav>
    
            `;

        document.body.prepend(header);

        return;

    }

    // Se a página for /perfil

    if (window.location.pathname === '/perfil') {

        var header = document.createElement('header');

        header.innerHTML = `

            <img src="../static/img/logo.png" alt="logo" id="logo" width="50" height="50">  

            <nav>

                <button id="btHome" type="button" onclick="window.location.href='/home'">Home</button>

                <button id="btLogout" type="button">Logout</button>

            </nav>

        `;

    }

    document.body.prepend(header);

});
