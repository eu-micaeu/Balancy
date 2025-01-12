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
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import 'react-toastify/dist/ReactToastify.css';
import './Header.css';
import { AuthContext } from '../../contexts/AuthContext';
import { removeAuthTokenFromCookies } from '../../utils/cookies';
import { RadioGroup, FormControlLabel, Radio, FormLabel, FormControl } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Importe o useNavigate

function Header() {
    
    const [open, setOpen] = useState(false);
    const [isRegister, setIsRegister] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [full_name, setFullName] = useState('');
    const [gender, setGender] = useState('');
    const [age, setAge] = useState('');
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [activity_level, setActivityLevel] = useState('');
    const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
    const navigate = useNavigate();


    const handleOpenLogin = () => {
        setIsRegister(false);
        setOpen(true);
    };

    const handleOpenRegister = () => {
        setIsRegister(true);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setUsername('');
        setPassword('');
        setEmail('');
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
                handleClose();

                navigate('/home'); // Redirecione o usuário para a página /home
            } else {
                toast.error('Credenciais inválidas');
            }
        } catch (error) {
            console.error(error);
            toast.error('Erro ao conectar ao servidor');
        }
    };

    const handleRegister = async () => {
        try {

            const requestBody = {
                username,
                email,
                password,
                full_name,
                gender,
                age,
                weight,
                height,
                activity_level,
            };

            requestBody.age = parseInt(requestBody.age);
            requestBody.weight = parseFloat(requestBody.weight);
            requestBody.height = parseFloat(requestBody.height);

            const response = await fetch('http://localhost:8080/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                toast.success('Registro bem-sucedido! Faça login.');
                setIsRegister(false);
                handleClose();
            } else {
                const errorData = await response.json();
                toast.error(`Erro no registro: ${errorData.error}`);
            }
        } catch (error) {
            console.error(error);
            toast.error('Erro ao conectar ao servidor');
        }
    };


    const handleLogout = () => {
        removeAuthTokenFromCookies();
        setIsLoggedIn(false);
        toast.success('Logout bem-sucedido');
        navigate('/'); // Redirecione o usuário para a página /home
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

                                fontFamily: 'Popins, sans-serif',

                            }}

                            onMouseEnter={(e) => (e.target.style.backgroundColor = '#D50062')}

                            onMouseLeave={(e) => (e.target.style.backgroundColor = '#FF006F')}

                        >

                            Logout

                        </Button>

                    ) : (

                        <Button

                            onClick={handleOpenLogin}

                            style={{

                                color: 'white',

                                backgroundColor: '#FF006F',

                                fontWeight: 'bold',

                                padding: '10px 20px',

                                marginRight: '20px',

                                fontFamily: 'Popins, sans-serif',

                            }}

                            onMouseEnter={(e) => (e.target.style.backgroundColor = '#D50062')}

                            onMouseLeave={(e) => (e.target.style.backgroundColor = '#FF006F')}

                        >

                            Login

                        </Button>

                    )}

                </nav>

            </header>

            <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>

                <DialogTitle

                    style={{

                        textAlign: 'center',

                        color: '#FF006F',

                        fontWeight: 'bold',

                    }}

                >
                    {isRegister ? 'Registro' : 'Login'}

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

                    {isRegister && (

                        <>

                            <TextField

                                label="Full Name"

                                fullWidth

                                value={full_name}

                                onChange={(e) => setFullName(e.target.value)}

                                style={{ marginBottom: 20 }}

                            />

                            <FormControl component="fieldset" style={{ marginBottom: 20 }}>

                                <FormLabel component="legend">Gender</FormLabel>

                                <RadioGroup

                                    value={gender}

                                    onChange={(e) => setGender(e.target.value)}

                                    row

                                >
                                    <FormControlLabel value="masculino" control={<Radio />} label="Masculino" />

                                    <FormControlLabel value="feminino" control={<Radio />} label="Feminino" />

                                </RadioGroup>

                            </FormControl>

                            <TextField

                                label="Age"

                                type="number"

                                fullWidth

                                value={age}

                                onChange={(e) => setAge(e.target.value)}

                                style={{ marginBottom: 20 }}

                            />

                            <TextField

                                label="Weight"

                                type="number"

                                fullWidth

                                value={weight}

                                onChange={(e) => setWeight(e.target.value)}

                                style={{ marginBottom: 20 }}

                            />

                            <TextField

                                label="Height"

                                type="number"

                                fullWidth

                                value={height}

                                onChange={(e) => setHeight(e.target.value)}

                                style={{ marginBottom: 20 }}

                            />

                            <FormControl component="fieldset" style={{ marginBottom: 20 }}>

                                <FormLabel component="legend" style={{ marginBottom: 10 }}>

                                    Nível de Atividade Física

                                </FormLabel>

                                <RadioGroup

                                    value={activity_level}

                                    onChange={(e) => setActivityLevel(e.target.value)}

                                    row

                                    style={{ display: 'flex', flexDirection: 'column' }}

                                >
                                    <FormControlLabel

                                        value="sedentary"

                                        control={<Radio />}

                                        label={

                                            <div>

                                                <strong>Sedentário</strong>

                                                <p style={{ margin: 0, fontSize: '0.9rem', color: '#555' }}>

                                                    Pouca ou nenhuma atividade física diária.

                                                </p>

                                            </div>

                                        }

                                    />

                                    <FormControlLabel

                                        value="light"

                                        control={<Radio />}

                                        label={

                                            <div>

                                                <strong>Atividade Leve</strong>

                                                <p style={{ margin: 0, fontSize: '0.9rem', color: '#555' }}>

                                                    Atividades leves, como caminhadas curtas (1-3 dias por semana).

                                                </p>

                                            </div>

                                        }

                                    />

                                    <FormControlLabel

                                        value="moderate"

                                        control={<Radio />}

                                        label={

                                            <div>

                                                <strong>Moderado</strong>

                                                <p style={{ margin: 0, fontSize: '0.9rem', color: '#555' }}>

                                                    Exercícios moderados ou atividades físicas regulares (3-5 dias por semana).

                                                </p>

                                            </div>

                                        }

                                    />

                                    <FormControlLabel

                                        value="active"

                                        control={<Radio />}

                                        label={

                                            <div>

                                                <strong>Ativo</strong>

                                                <p style={{ margin: 0, fontSize: '0.9rem', color: '#555' }}>

                                                    Exercícios intensos ou atividades físicas frequentes (6-7 dias por semana).

                                                </p>

                                            </div>

                                        }

                                    />

                                    <FormControlLabel

                                        value="very_active"

                                        control={<Radio />}

                                        label={

                                            <div>

                                                <strong>Muito Ativo</strong>

                                                <p style={{ margin: 0, fontSize: '0.9rem', color: '#555' }}>

                                                    Atividade física extremamente intensa, como treinos profissionais ou trabalhos físicos exigentes.

                                                </p>

                                            </div>

                                        }

                                    />

                                </RadioGroup>

                            </FormControl>

                        </>

                    )}

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

                    {isRegister ? (

                        <>

                            <Button

                                onClick={handleRegister}

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

                                Registrar

                            </Button>

                            <Button

                                onClick={handleOpenLogin}

                                style={{ color: '#FF006F', fontWeight: 'bold' }}

                            >

                                Já tem uma conta? Login

                            </Button>

                        </>

                    ) : (

                        <>

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

                            <Button

                                onClick={handleOpenRegister}

                                style={{ color: '#FF006F', fontWeight: 'bold' }}

                            >

                                Não tem conta? Registre-se

                            </Button>

                        </>

                    )}

                </DialogActions>

            </Dialog>

            <ToastContainer />

        </>

    );

}

export default Header;