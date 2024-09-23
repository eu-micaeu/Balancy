import { getCookie } from './getCookie.mjs';
import { attMeals } from './attMeals.mjs';

function btCreateMealConfirm() {

    // Resgatar o que tiver depois de /menu/ e transformar em inteiro
    var path = parseInt(window.location.pathname.split('/menu/')[1]);

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

                attMeals();

            }

        });


    });

}

export { btCreateMealConfirm };