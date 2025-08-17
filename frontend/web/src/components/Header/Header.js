import { useState, useContext } from 'react';
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
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import 'react-toastify/dist/ReactToastify.css';
import './Header.css';
import { AuthContext } from '../../contexts/AuthContext';
import { ThemeContext } from '../../contexts/ThemeContext';
import { removeAuthTokenFromCookies } from '../../utils/cookies';
import { RadioGroup, FormControlLabel, Radio, FormLabel, FormControl } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Importe o useNavigate

function Header() {

    const apiUrl = process.env.REACT_APP_API_URL;

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
    const { theme, toggleTheme } = useContext(ThemeContext);
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
            const response = await fetch(`${apiUrl}/login`, {
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

            const response = await fetch(`${apiUrl}/register`, {
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

                    {/* Theme toggle button */}
                    <IconButton
                        onClick={toggleTheme}
                        style={{
                            marginRight: 10,
                            color: 'var(--primary)',
                            border: '1px solid var(--primary)',
                            background: 'transparent',
                            borderRadius: '50%'
                        }}
                        title={theme === 'light' ? 'Alterar para modo escuro' : 'Alterar para modo claro'}
                    >
                        {theme === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
                    </IconButton>

                    {isLoggedIn ? (

                        <>

                            <IconButton

                                aria-label="menu"

                                style={{ color: 'var(--primary)', marginRight: '10px' }}

                                title="Menu"

                            >
                                <MiscellaneousServicesIcon />

                            </IconButton>

                            <Button

                                onClick={handleLogout}

                                style={{

                                    color: 'var(--surface)',

                                    backgroundColor: 'var(--primary)',

                                    fontWeight: 'bold',

                                    padding: '10px 20px',

                                    marginRight: '20px',

                                    fontFamily: 'Popins, sans-serif',

                                }}

                                onMouseEnter={(e) => (e.target.style.backgroundColor = 'var(--primary-700)')}

                                onMouseLeave={(e) => (e.target.style.backgroundColor = 'var(--primary)')}

                            >

                                Logout

                            </Button>

                        </>


                    ) : (

                        <Button

                            onClick={handleOpenLogin}

                            style={{

                                color: 'var(--surface)',

                                backgroundColor: 'var(--primary)',

                                fontWeight: 'bold',

                                padding: '10px 20px',

                                marginRight: '20px',

                                fontFamily: 'Popins, sans-serif',

                            }}

                            onMouseEnter={(e) => (e.target.style.backgroundColor = 'var(--primary-700)')}

                            onMouseLeave={(e) => (e.target.style.backgroundColor = 'var(--primary)')}

                        >

                            Login

                        </Button>

                    )}

                </nav>

            </header>

            <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth PaperProps={{
                style: {
                    borderRadius: 18,
                    boxShadow: '0 8px 32px rgba(44,62,80,0.18)',
                    border: '2px solid var(--primary)',
                    padding: 0,
                    background: 'var(--surface)',
                }
            }}>

                <DialogTitle
                    style={{
                        textAlign: 'center',
                        color: 'var(--primary)',
                        fontWeight: 'bold',
                        fontSize: '1.6rem',
                        letterSpacing: 1,
                        borderBottom: '1px solid #eee',
                        paddingBottom: 12,
                        position: 'relative',
                    }}
                >
                    {isRegister ? 'Registro' : 'Login'}
                    <IconButton aria-label="close" onClick={handleClose} style={{ position: 'absolute', right: 8, top: 8, color: 'var(--primary)' }}>
                        <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>×</span>
                    </IconButton>
                </DialogTitle>

                <DialogContent
                    style={{
                        backgroundColor: 'var(--surface)',
                        padding: '32px 24px 12px 24px',
                        minWidth: 320,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 12,
                    }}
                >
                    <TextField
                        label="Usuário"
                        fullWidth
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        autoFocus
                        style={{
                            marginBottom: 16,
                            borderRadius: '8px',
                            backgroundColor: 'var(--surface)',
                            boxShadow: '0 2px 8px rgba(44,62,80,0.08)',
                        }}
                    />

                    {isRegister && (

                        <>

                            <TextField

                                label="Email"

                                fullWidth

                                type="email"

                                value={email}

                                onChange={(e) => setEmail(e.target.value)}

                                style={{ marginBottom: 20 }} />

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

                                                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text)' }}>

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

                                                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text)' }}>

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

                                                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text)' }}>

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

                                                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text)' }}>

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

                                                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text)' }}>

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
                        label="Senha"
                        fullWidth
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{
                            marginBottom: 8,
                            borderRadius: '8px',
                            backgroundColor: 'var(--surface)',
                            boxShadow: '0 2px 8px rgba(44,62,80,0.08)',
                        }}
                    />

                </DialogContent>

                <DialogActions style={{ justifyContent: 'center', paddingBottom: 18 }}>

                    {isRegister ? (

                        <>

                            <Button

                                onClick={handleRegister}

                                color="primary"

                                style={{

                                    backgroundColor: 'var(--primary)',

                                    color: 'var(--surface)',

                                    fontWeight: 'bold',

                                    padding: '10px 30px',

                                    borderRadius: '5px',

                                }}

                                onMouseEnter={(e) =>

                                    (e.target.style.backgroundColor = 'var(--primary-700)')

                                }

                                onMouseLeave={(e) =>

                                    (e.target.style.backgroundColor = 'var(--primary)')

                                }

                            >

                                Registrar

                            </Button>

                            <Button

                                onClick={handleOpenLogin}

                                style={{ color: 'var(--primary)', fontWeight: 'bold' }}

                            >

                                Já tem uma conta? Login

                            </Button>

                        </>

                    ) : (

                        <>

                            <Button

                                onClick={handleLogin}

                                style={{

                                    backgroundColor: 'var(--primary)',

                                    color: 'var(--surface)',

                                    fontWeight: 'bold',

                                    padding: '10px 30px',

                                    borderRadius: '5px',

                                }}

                                onMouseEnter={(e) =>
                                    (e.target.style.backgroundColor = 'var(--primary-700)')
                                }
                                onMouseLeave={(e) =>
                                    (e.target.style.backgroundColor = 'var(--primary)')
                                }

                            >

                                Entrar

                            </Button>

                            <Button

                                onClick={handleOpenRegister}

                                style={{ color: 'var(--primary)', fontWeight: 'bold' }}

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