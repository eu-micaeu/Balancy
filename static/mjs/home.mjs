import { openOverlay } from './functions/openOverlay.mjs';
import { closeOverlay } from './functions/closeOverlay.mjs';
import { loadMenu } from './functions/loadMenu.mjs';
import { btCreate } from './functions/btCreate.mjs';
import { btLogout } from './functions/btLogout.mjs';

document.addEventListener("DOMContentLoaded", function () {

    fetch('/getUser', {

        method: 'GET',

        headers: {

            'Content-Type': 'application/json'

        }

    }).then(response => {

        if (response.status === 200) {

            return response.json();

        } else {

            throw new Error('Erro ao buscar usuário');

        }

    })

    .then(data => {

        // Calcular IMC

        var weight = data.weight;

        var height = data.height;

        fetch('/calculateIMC', {

            method: 'POST',

            headers: {

                'Content-Type': 'application/json'

            },

            body: JSON.stringify({ weight: weight, height: height })

        }).then(response => {

            if (response.status === 200) {

                return response.json();

            } else {

                throw new Error('Erro ao calcular IMC');

            }

        }

        ).then(data => {

            var textIMC = document.getElementById('textIMC');

            var imc = data.imc;

            imc = imc.toFixed(2);

            textIMC.innerHTML = `{IMC: ${imc}}`;

        }).catch(error => {

            console.log(error);

        })

        // Calcular TDEE

        var age = data.age;

        var gender = data.gender;

        var activity_level = data.activity_level;

        fetch('/calculateTDEE', {

            method: 'POST',

            headers: {

                'Content-Type': 'application/json'

            },

            body: JSON.stringify({ weight: weight, height: height, age: age, gender: gender, activity_level: activity_level })

        }).then(response => {

            if (response.status === 200) {

                return response.json();

            } else {

                throw new Error('Erro ao calcular TDEE');

            }

        }

        ).then(data => {

            var textTDEE = document.getElementById('textTDEE');

            var tdee = data.tdee;

            tdee = tdee.toFixed(2);

            textTDEE.innerHTML = `{TDEE: ${tdee}}`;

        })

    })
        
    btCreate();

    btLogout();

    loadMenu();

    var spin = document.getElementById('spin');

    var main = document.getElementsByTagName('main')[0];

    setTimeout(function () {

        main.style.display = 'flex';

        spin.style.display = 'none';

    }, 2000);

});

// Lógica de adicionar refeição
document.getElementById('btAddMeal').addEventListener('click', function () {

    openOverlay('popUpCreateMeal');

});


document.getElementById('divOverlay').addEventListener('click', function () {

    closeOverlay('popUpCreateMeal');

    closeOverlay('popUpCreateFood');

    closeOverlay('popUpCreateMenu');

});