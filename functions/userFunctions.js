function calculateDailyCalories(user) {

    try {

        if (!user) {

            return console.log('User not found');

        }

        const { height, weight, gender, age, activityLevel } = user;

        // Calculate Basal Metabolic Rate (BMR) 
        let bmr;

        if (gender == 'M') {

            bmr = 88.362 + (13.397 * weight) + (4.799 * height * 100) - (5.677 * age);

        } else if (gender == 'F') {

            bmr = 447.593 + (9.247 * weight) + (3.098 * height * 100) - (4.330 * age);

        } else {

            return console.log('Invalid gender');

        }

        let calories;

        switch (activityLevel) {

            case 'sedentary':

                calories = bmr * 1.2;

                break;

            case 'light':

                calories = bmr * 1.375;

                break;

            case 'moderate':

                calories = bmr * 1.55;

                break;

            case 'active':

                calories = bmr * 1.725;

                break;

            case 'very_active':

                calories = bmr * 1.9;

                break;

            default:

                return console.log('Invalid activity level');

        }

        return calories.toFixed(0);

    } catch (error) {

        return console.log(error.message);

    }

};

function calculateIMC(user) {

    try {

        if (!user) {

            return console.log('User not found');

        }

        const { height, weight } = user;

        const imc = weight / Math.pow(height, 2);

        return imc.toFixed(2);

    } catch (error) {

        return console.log(error.message);

    }

};

module.exports = { calculateDailyCalories, calculateIMC };