import { getCookie } from './getCookie.mjs';

function btCreateMealConfirm(path) {

    document.getElementById('btCreateMealConfirm').addEventListener('click', function () {

        var mealName = document.getElementById('mealName').value;

        fetch('/createMeal', {

            method: 'POST',

            headers: {

                'Content-Type': 'application/json',

                'Authorization': getCookie()

            },

            body: JSON.stringify({ 

                menu_id: path,
                meal_name: mealName 

            })

        }).then(response => {

            if (response.ok) {

                document.getElementById('divOverlay').click();

            }

        });


    });

}

export { btCreateMealConfirm };