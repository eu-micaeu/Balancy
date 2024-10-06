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



        })
        .catch(error => console.error('Error:', error));

});
