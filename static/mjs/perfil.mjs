import { btLogout } from './functions/btLogout.mjs';

document.addEventListener('DOMContentLoaded', function () {

    btLogout();

    fetch('/getUser', {

        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }

    }).then(response => response.json())

        .then(data => {

            document.getElementById('username').value = data.username;
            document.getElementById('email').value = data.email;
            document.getElementById('fullName').value = data.full_name;
            
            if(data.gender === 'M'){

                document.getElementById('gender').value = 'Masculino';

            } else if(data.gender === 'F'){

                document.getElementById

            }

            document.getElementById('age').value = data.age;
            document.getElementById('weight').value = data.weight;
            document.getElementById('height').value = data.height;
            document.getElementById('activityLevel').value = data.activity_level;

            var imc = data.weight / (data.height * data.height);

            var mensagem = '';

            if(imc < 18.5){

                mensagem = 'Abaixo do peso';

            } else if(imc >= 18.5 && imc < 24.9){

                mensagem = 'Peso normal';

            } else if(imc >= 25 && imc < 29.9){

                mensagem = 'Sobrepeso';

            } else if(imc >= 30 && imc < 34.9){

                mensagem = 'Obesidade grau 1';

            } else if(imc >= 35 && imc < 39.9){

                mensagem = 'Obesidade grau 2';

            } else if(imc >= 40){

                mensagem = 'Obesidade grau 3';

            }

            document.getElementById('imc').textContent = 'IMC: ' + imc.toFixed(2) + ' - ' + mensagem;

            
            var tmrBase;
            var weight = data.weight;
            var height = data.height; 
            var age = data.age;
            var gender = data.gender;

            if (gender === 'M') {

                tmrBase = 88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age);

            } else if (gender === 'F') {

                tmrBase = 447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age);

            }

            var activityLevel = data.activity_level;

            var tmr;

            switch (activityLevel) {

                case 'sedentary':

                    tmr = tmrBase * 1.2;

                    break;

                case 'light':

                    tmr = tmrBase * 1.375;

                    break;

                case 'moderate':

                    tmr = tmrBase * 1.55;

                    break;

                case 'active':

                    tmr = tmrBase * 1.725;

                    break;

                case 'very_active':

                    tmr = tmrBase * 1.9;

                    break;

                default:

                    alert('Erro ao calcular TMR');

            }

            document.getElementById('tmr').textContent = 'TMR: ' + tmr.toFixed(2) + ' kcal';

        })

        .catch(error => console.error('Error:', error));


});