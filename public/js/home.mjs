import { getCookie } from './getCookie.mjs';

const openpopup = document.getElementById("btAddFood")

openpopup.addEventListener('click', function () {

    document.getElementById('popupContent').style.display = 'flex';

    document.getElementById('overlay').style.display = 'block';

    console.log(getCookie('menu_id'));

})


const closePopupFood = document.getElementById("closePopupFood")

closePopupFood.addEventListener('click', function () {

    document.getElementById('popupContent').style.display = 'none';

    document.getElementById('overlay').style.display = 'none';

})

document.getElementById('overlay').addEventListener('click', function () {

    document.getElementById('popupContent').style.display = 'none';

    document.getElementById('overlay').style.display = 'none';

    document.getElementById('configForm').classList.remove('show');

})

document.getElementById('btConfirm').addEventListener('click', function () {

    const nameFood = document.getElementById('nameFood').value;

    const caloriesFood = parseInt(document.getElementById('caloriesFood').value);

    const quantityFood = parseInt(document.getElementById('quantityFood').value);

    fetch('/api/menus/addFoodToMenu', {

        method: 'POST',

        headers: {

            'Content-Type': 'application/json'

        },

        body: JSON.stringify({

            menu_id: parseInt(getCookie('menu_id')),

            food: {

                food_name: nameFood,

                food_quantity: quantityFood,

                food_calories: caloriesFood

            }

        })

    })
        .then(response => response.json())

        .then(data => {

            console.log('Success:', data);

        })

        .catch((error) => {

            return console.error('Error:', error);

        });

});


document.getElementById('btGeneratePDF').addEventListener('click', function () {

    const { jsPDF } = window.jspdf;

    const pdf = new jsPDF();

    const menu = document.getElementById('menu');

    html2canvas(menu).then(function (canvas) {

        const imgData = canvas.toDataURL('img/logo.png');

        const imgWidth = 190;

        const pageHeight = 290;

        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        let heightLeft = imgHeight;

        let position = 10;

        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);

        heightLeft -= pageHeight;

        while (heightLeft >= 0) {

            position = heightLeft - imgHeight;

            pdf.addPage();

            pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);

            heightLeft -= pageHeight;

        }

        var nameDocument = document.getElementById('menu_name').textContent;

        pdf.save(nameDocument + '.pdf');

    });

});

// Obtém os valores das calorias do DOM
const dailyCalories = Number(document.getElementById('dailyCalories').innerText);
const totalCalories = Number(document.getElementById('totalCalories').innerText);

const ctx = document.getElementById('caloriesChart').getContext('2d');

const caloriesChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Gasto Diário', 'Dieta Atual'],
        datasets: [{
            label: 'Calorias (kCal)',
            data: [dailyCalories - 500, totalCalories],
            backgroundColor: [
                'rgba(75, 192, 192, 0.2)',
                'rgba(255, 99, 132, 0.2)'
            ],
            borderColor: [
                'rgba(75, 192, 192, 1)',
                'rgba(255, 99, 132, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        },
        plugins: {
            title: {
                display: true,
                text: 'Comparação da Dieta com o Consumo Diário que gera Perda de Peso'
            },
            legend: {
                display: false
            }
        }
    }
});

