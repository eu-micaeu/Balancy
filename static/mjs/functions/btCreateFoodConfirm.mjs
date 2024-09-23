import { getCookie } from './getCookie.mjs';

function btCreateFoodConfirm(path) {

    document.getElementById('btCreateFoodConfirm').addEventListener('click', function () {

        var foodName = document.getElementById('foodName').value;

        var calories = parseInt(document.getElementById('foodCalories').value);

        var quantity = parseInt(document.getElementById('foodQuantity').value);

        fetch('/createFood', {

            method: 'POST',

            headers: {

                'Content-Type': 'application/json',

                'Authorization': getCookie()

            },

            body: JSON.stringify({ 

                meal_id: path,
                food_name: foodName,
                calories: calories,
                quantity: quantity

            })

        }).then(response => {

            if (response.ok) {

                document.getElementById('divOverlay').click();

            }

        });


    });

}

export { btCreateFoodConfirm };