import React, { useState, useContext } from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    Button,
    TextField,
    DialogTitle,
    IconButton,
} from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';import 'react-toastify/dist/ReactToastify.css';
import './Header.css';
import { AuthContext } from '../../contexts/AuthContext';
import {removeAuthTokenFromCookies} from "../../utils/cookies";

function Header() {
    const [open, setOpen] = useState(false); // Controle do diálogo
    const [username, setUsername] = useState(''); // Input do nome de usuário
    const [password, setPassword] = useState(''); // Input da senha
    const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext); // Consumo do AuthContext

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleLogin = async () => {
        try {
            const response = await fetch('http://localhost:8080/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json();
                const token = data.token;

                document.cookie = `authToken=${token}; path=/; max-age=3600; Secure; SameSite=Strict`;

                toast.success('Login bem-sucedido');

                setIsLoggedIn(true);

                setOpen(false);

            } else {

                toast.error('Credenciais inválidas');

            }

        } catch (error) {

            console.error(error);

            toast.error('Erro ao conectar ao servidor');

        }

    };

    const handleLogout = () => {

        removeAuthTokenFromCookies()

        setIsLoggedIn(false);

        toast.success('Logout bem-sucedido');

    };

    return (

        <>

            <header>

                <img src="/logoPrincipal.png" alt="Logo" width={100} height={100} />

                <nav style={{ display: 'flex', alignItems: 'center' }}>

                    {isLoggedIn && (

                        <IconButton
                            aria-label="menu"
                            style={{ color: '#FF006F', marginRight: '10px' }}
                            title="Menu"
                        >
                            <MiscellaneousServicesIcon />

                        </IconButton>

                    )}

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
                            onMouseEnter={(e) => (e.target.style.backgroundColor = '#D50062')}
                            onMouseLeave={(e) => (e.target.style.backgroundColor = '#FF006F')}
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
                            onMouseEnter={(e) => (e.target.style.backgroundColor = '#D50062')}
                            onMouseLeave={(e) => (e.target.style.backgroundColor = '#FF006F')}
                        >
                            Login
                        </Button>
                    )}
                </nav>
            </header>

            {/* Diálogo de Login */}
            <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
                <DialogTitle
                    style={{
                        textAlign: 'center',
                        color: '#FF006F',
                        fontWeight: 'bold',
                    }}
                >
                    Login
                </DialogTitle>
                <DialogContent
                    style={{
                        backgroundColor: '#f9f9f9',
                        padding: '30px',
                    }}
                >
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
                        onMouseEnter={(e) =>
                            (e.target.style.backgroundColor = '#D50062')
                        }
                        onMouseLeave={(e) =>
                            (e.target.style.backgroundColor = '#FF006F')
                        }
                    >
                        Entrar
                    </Button>
                </DialogActions>
            </Dialog>

            <ToastContainer />
        </>
    );
}

export default Header;