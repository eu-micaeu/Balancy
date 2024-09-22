document.getElementById('btEnter').addEventListener('click', function() {

    var username = document.getElementById('username').value;

    var password = document.getElementById('password').value;

    console.log('username:', username);

    fetch('/login', {

        method: 'POST',

        headers: {

            'Content-Type': 'application/json'  

        },

        body: JSON.stringify({       
                    
            username: username,

            password: password

        })

    })

    .then(response => {

        if (response.ok) {        

            window.location.href = '/home'; 

        } else {

            throw new Error('Login failed');  

        }
    })

    .catch(error => {

        console.error('Error:', error);        

        alert('Login failed: ' + error.message);

    });

});
