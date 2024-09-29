document.getElementById('btRegister').addEventListener('click', function () {

    var fullName = document.getElementById('fullName').value;

    var email = document.getElementById('email').value;

    var password = document.getElementById('password').value;

    var confirmPassword = document.getElementById('confirmPassword').value;

    var gender = document.getElementById('gender').value;

    var age = document.getElementById('age').value;

    var weight = document.getElementById('weight').value;

    var height = document.getElementById('height').value;

    var activityLevel = document.getElementById('activityLevel').value;

    if (!fullName || !email || !password || !confirmPassword || !gender || !age || !weight || !height || !activityLevel) {

        alert('Preencha todos os campos.');

        return;

    }

    if (password !== confirmPassword) {

        alert('As senhas não coincidem.');

        return;

    }

    var data = {

        fullName: fullName,

        email: email,

        password: password,

        gender: gender,

        age: age,

        weight: weight,

        height: height,

        activityLevel: activityLevel

    };

    fetch('/register', {

        headers: {

            'Content-Type': 'application/json'

        },

        method: 'POST',

        body: JSON.stringify(data)

    }).then(function (response) {

        if (response.status === 200) {

            window.location.href = '/';

        } else {

            alert('Erro ao cadastrar usuário.');

        }

    });

});