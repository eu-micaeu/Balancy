const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

module.exports = (req, res, next) => {

  const token = req.cookies.jwt // Obter token 
  
  if (!token) {
    
    return res.status(401).json({ error: 'Acesso negado' }); // Verificar se o token foi enviado

  }

  try {

    const verified = jwt.verify(token, process.env.JWT_SECRET); // Verificar se o token é válido

    req.user = verified; // Adicionar o usuário ao objeto de requisição

    next(); // Continuar a execução

  } catch (error) {

    res.status(400).json({ error: 'Token inválido' }); // Retornar erro caso o token seja inválido

  }
  
};