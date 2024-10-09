document.getElementById('btRegister').addEventListener('click', function () {

    var username = document.getElementById('username').value;
    var fullName = document.getElementById('fullName').value;
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    var confirmPassword = document.getElementById('confirmPassword').value;
    var gender = document.getElementById('gender').value;
    var age = parseInt(document.getElementById('age').value);
    var weight = parseFloat(document.getElementById('weight').value);
    var height = parseFloat(document.getElementById('height').value);
    var activityLevel = document.getElementById('activityLevel').value;

    // Verificação se todos os campos estão preenchidos
    if (!fullName || !email || !password || !confirmPassword || !gender || !age || !weight || !height || !activityLevel || !username) {
        alert('Preencha todos os campos.');
        return;
    }

    // Restrição de username (entre 4 e 20 caracteres, sem caracteres especiais)
    var usernamePattern = /^[a-zA-Z0-9_]{4,20}$/;
    if (!usernamePattern.test(username)) {
        alert('O nome de usuário deve ter entre 4 e 20 caracteres e não conter caracteres especiais.');
        return;
    }

    // Restrição de email (formato de email válido)
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        alert('Digite um email válido.');
        return;
    }

    // Restrição de senha (mínimo 8 caracteres, com letras maiúsculas, minúsculas, números e caracteres especiais)
    var passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordPattern.test(password)) {
        alert('A senha deve conter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais.');
        return;
    }

    // Verificação se as senhas coincidem
    if (password !== confirmPassword) {
        alert('As senhas não coincidem.');
        return;
    }

    // Restrição de idade (mínimo 13 anos, máximo 120 anos)
    if (isNaN(age) || age < 13 || age > 120) {
        alert('A idade deve ser um número entre 13 e 120.');
        return;
    }

    // Verificação de peso e altura (deve ser um número válido)
    if (isNaN(weight) || weight <= 0) {
        alert('O peso deve ser um número válido.');
        return;
    }

    if (isNaN(height) || height <= 0) {
        alert('A altura deve ser um número válido.');
        return;
    }

    // Verificação de nível de atividade (deve ser selecionado)
    if (!activityLevel) {
        alert('Selecione o nível de atividade.');
        return;
    }

    // Dados a serem enviados para o servidor
    var data = {
        username: username,
        full_name: fullName,
        email: email,
        password: password,
        gender: gender,
        age: age,
        weight: weight,
        height: height,
        activity_level: activityLevel
    };

    // Enviando dados ao servidor via fetch
    fetch('/register', {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(data)
    }).then(function (response) {
        if (response.status === 200) {
            window.location.href = '/';
        } else {
            alert('Erro ao cadastrar usuário.');
        }
    });
});
