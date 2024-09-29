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

            if (data.gender === 'M') {
                document.getElementById('gender').value = 'Masculino';
            } else if (data.gender === 'F') {
                document.getElementById('gender').value = 'Feminino';
            }

            document.getElementById('age').value = data.age + ' anos';
            document.getElementById('weight').value = data.weight + ' kg';
            document.getElementById('height').value = data.height + ' m';
            document.getElementById('activityLevel').value = data.activity_level;

            // Cálculo do IMC (Índice de Massa Corporal)
            // Cálculo do IMC (Índice de Massa Corporal)
            var imc = data.weight / (data.height * data.height);
            var mensagem = '';

            if (imc < 18.5) {
                mensagem = 'Abaixo do peso';
            } else if (imc >= 18.5 && imc < 24.9) {
                mensagem = 'Peso normal';
            } else if (imc >= 25 && imc < 29.9) {
                mensagem = 'Sobrepeso';
            } else if (imc >= 30 && imc < 34.9) {
                mensagem = 'Obesidade grau 1';
            } else if (imc >= 35 && imc < 39.9) {
                mensagem = 'Obesidade grau 2';
            } else if (imc >= 40) {
                mensagem = 'Obesidade grau 3';
            }

            document.getElementById('imcValue').textContent = 'IMC: ' + imc.toFixed(2) + ' - ' + mensagem;

            // Movendo a barra conforme o valor do IMC
            var imcBarIndicator = document.getElementById('imcBarIndicator');
            var imcPercentage = (imc / 50) * 100; // Convertendo o IMC para uma porcentagem dentro da faixa 0-50
            if (imcPercentage > 100) imcPercentage = 100; // Limitando a barra a 100% no máximo

            imcBarIndicator.style.width = imcPercentage + '%';


            // Cálculo da TMB (Taxa de Metabolismo Basal)
            // TMB é a quantidade de calorias que o corpo queima em repouso total (sem considerar atividades físicas).
            var tmb;
            var weight = data.weight;
            var height = data.height * 100; // Convertendo altura para cm
            var age = data.age;
            var gender = data.gender;

            if (gender === 'M') {
                tmb = 88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age);
            } else if (gender === 'F') {
                tmb = 447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age);
            }

            document.getElementById('tmb').textContent = 'TMB (Taxa de Metabolismo Basal): ' + tmb.toFixed(2) + ' kcal';

            // Cálculo do TMR (Taxa Metabólica de Repouso)
            // TMR é a quantidade de calorias que o corpo queima considerando o nível de atividade física.
            var tmr;
            switch (data.activity_level) {
                case 'sedentary':
                    tmr = tmb * 1.2;
                    break;
                case 'light':
                    tmr = tmb * 1.375;
                    break;
                case 'moderate':
                    tmr = tmb * 1.55;
                    break;
                case 'active':
                    tmr = tmb * 1.725;
                    break;
                case 'very_active':
                    tmr = tmb * 1.9;
                    break;
                default:
                    alert('Erro ao calcular TMR');
            }

            document.getElementById('tmr').textContent = 'TMR (Taxa Metabólica de Repouso): ' + tmr.toFixed(2) + ' kcal';

        })
        .catch(error => console.error('Error:', error));

});
