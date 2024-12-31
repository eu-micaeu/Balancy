import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, Button, TextField, DialogTitle } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import { jwtDecode } from 'jwt-decode';
import './Header.css';

function Header() {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const checkTokenValidity = () => {
      const token = getCookie('authToken');
  
      if (!token) return false;
  
      try {

        const decoded = jwtDecode(token);
  
        if (decoded.exp && Date.now() >= decoded.exp * 1000) {
          return false; // Token expirado
        }
  
        return true; // Token válido
      } catch (error) {
        console.error('Erro ao decodificar o token:', error);
        return false; // Token inválido
      }
    };
  
    const checkLoginStatus = () => {
      const tokenIsValid = checkTokenValidity();
      setIsLoggedIn(tokenIsValid);
    };
  
    checkLoginStatus();
  }, []);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  const handleLogin = async () => {

    try {

      const response = await fetch('http://localhost:8080/login', {

        method: 'POST',

        headers: {

          'Content-Type': 'application/json',

        },

        body: JSON.stringify({ username: username, password: password }),

      });

      if (response.ok) {
        const data = await response.json();
        const token = data.token;

        document.cookie = `authToken=${token}; path=/; max-age=3600; Secure; SameSite=Strict`;

        toast.success('Login bem-sucedido'); 

        setOpen(false);

        setIsLoggedIn(true);
      } else {
        toast.error('Credenciais inválidas'); 
      }
    } catch (error) {
      toast.error('Erro ao conectar ao servidor');  
    }
  };

  const handleLogout = () => {

    document.cookie = 'authToken=; path=/; max-age=0';  
    
    setIsLoggedIn(false);

    toast.error('Logout bem-sucedido');  
    
  };

  return (

    <>

    <header>

      <img src="/logoPrincipal.png" alt="Logo" width={100} height={100} />

      <nav>
        {isLoggedIn ? (
          <Button
            onClick={handleLogout}
            style={{
              color: 'white',
              backgroundColor: '#FF006F',
              fontWeight: 'bold',
              padding: '10px 20px',
              marginRight: '20px',
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#D50062'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#FF006F'}
          >
            Logout
          </Button>
        ) : (
          <Button
            onClick={handleClickOpen}
            style={{
              color: 'white',
              backgroundColor: '#FF006F',
              fontWeight: 'bold',
              padding: '10px 20px',
              marginRight: '20px',
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#D50062'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#FF006F'}
          >
            Login
          </Button>
        )}
      </nav>

      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle style={{ textAlign: 'center', color: '#FF006F', fontWeight: 'bold' }}>
          Login
        </DialogTitle>

        <DialogContent style={{ backgroundColor: '#f9f9f9', padding: '30px' }}>
          <TextField
            label="Username"
            fullWidth
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              marginBottom: 20,
              borderRadius: '5px',
              backgroundColor: '#fff',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
          />

          <TextField
            label="Password"
            fullWidth
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              marginBottom: 5,
              borderRadius: '5px',
              backgroundColor: '#fff',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
          />
        </DialogContent>

        <DialogActions style={{ justifyContent: 'center' }}>
          <Button
            onClick={handleLogin}
            color="primary"
            style={{
              backgroundColor: '#FF006F',
              color: '#fff',
              fontWeight: 'bold',
              padding: '10px 30px',
              borderRadius: '5px',
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#D50062'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#FF006F'}
          >
            Entrar
          </Button>
        </DialogActions>
      </Dialog>
      
    </header>
    
    <ToastContainer /> 

    </>

  );

}

export default Header;
