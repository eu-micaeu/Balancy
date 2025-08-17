import { useState, useContext } from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    Button,
    TextField,
    DialogTitle,
    IconButton,
    ThemeProvider as MuiThemeProvider,
    createTheme,
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

    // Criar tema personalizado do Material-UI baseado no tema atual
    const muiTheme = createTheme({
        palette: {
            mode: theme,
            primary: {
                main: '#B00020',
                dark: '#8A0018',
            },
            background: {
                paper: theme === 'dark' ? '#1a1a1a' : '#ffffff',
                default: theme === 'dark' ? '#121212' : '#ffffff',
            },
            text: {
                primary: theme === 'dark' ? '#ffffff' : '#000000',
                secondary: theme === 'dark' ? '#cccccc' : '#666666',
            },
            divider: theme === 'dark' ? '#333333' : '#e0e0e0',
        },
        components: {
            MuiTextField: {
                styleOverrides: {
                    root: {
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: theme === 'dark' ? '#2a2a2a' : '#ffffff',
                            '& fieldset': {
                                borderColor: theme === 'dark' ? '#555555' : '#cccccc',
                            },
                            '&:hover fieldset': {
                                borderColor: '#B00020',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#B00020',
                            },
                        },
                        '& .MuiInputLabel-root': {
                            color: theme === 'dark' ? '#cccccc' : '#666666',
                            '&.Mui-focused': {
                                color: '#B00020',
                            },
                        },
                        '& .MuiOutlinedInput-input': {
                            color: theme === 'dark' ? '#ffffff' : '#000000',
                        },
                    },
                },
            },
            MuiDialog: {
                styleOverrides: {
                    paper: {
                        backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
                        color: theme === 'dark' ? '#ffffff' : '#000000',
                        boxShadow: theme === 'dark'
                            ? '0 8px 32px rgba(0,0,0,0.6)'
                            : '0 8px 32px rgba(44,62,80,0.18)',
                    },
                },
            },
            MuiDialogTitle: {
                styleOverrides: {
                    root: {
                        backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
                        color: theme === 'dark' ? '#ffffff' : '#000000',
                        borderBottom: theme === 'dark' ? '1px solid #333' : '1px solid #eee',
                    },
                },
            },
            MuiDialogContent: {
                styleOverrides: {
                    root: {
                        backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
                        color: theme === 'dark' ? '#ffffff' : '#000000',
                    },
                },
            },
            MuiDialogActions: {
                styleOverrides: {
                    root: {
                        backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
                        borderTop: theme === 'dark' ? '1px solid #333' : '1px solid #eee',
                    },
                },
            },
            MuiFormLabel: {
                styleOverrides: {
                    root: {
                        color: theme === 'dark' ? '#ffffff' : '#000000',
                        '&.Mui-focused': {
                            color: '#B00020',
                        },
                    },
                },
            },
            MuiRadio: {
                styleOverrides: {
                    root: {
                        color: theme === 'dark' ? '#cccccc' : '#666666',
                        '&.Mui-checked': {
                            color: '#B00020',
                        },
                        '&:hover': {
                            backgroundColor: theme === 'dark'
                                ? 'rgba(176, 0, 32, 0.1)'
                                : 'rgba(176, 0, 32, 0.04)',
                        },
                    },
                },
            },
            MuiFormControlLabel: {
                styleOverrides: {
                    label: {
                        color: theme === 'dark' ? '#ffffff' : '#000000',
                    },
                },
            },
            MuiButton: {
                styleOverrides: {
                    root: {
                        '&.MuiButton-text': {
                            color: theme === 'dark' ? '#ffffff' : '#000000',
                        },
                    },
                },
            },
            MuiIconButton: {
                styleOverrides: {
                    root: {
                        color: theme === 'dark' ? '#ffffff' : '#000000',
                        '&:hover': {
                            backgroundColor: theme === 'dark'
                                ? 'rgba(255, 255, 255, 0.1)'
                                : 'rgba(0, 0, 0, 0.04)',
                        },
                    },
                },
            },
        },
    });


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

                toast.success('🎉 Login realizado com sucesso!', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });

                setIsLoggedIn(true);

                // Adicionar delay para mostrar o toast antes de redirecionar
                setTimeout(() => {
                    navigate('/home');
                }, 3000);


            } else {
                toast.error('❌ Credenciais inválidas', {
                    position: "top-right",
                    autoClose: 3000,
                });
            }
        } catch (error) {
            console.error(error);
            toast.error('🔌 Erro ao conectar ao servidor', {
                position: "top-right",
                autoClose: 3000,
            });
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
                toast.success('🎉 Registro realizado com sucesso! Faça login.', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                setIsRegister(false);
                handleClose();
            } else {
                const errorData = await response.json();
                toast.error(`❌ Erro no registro: ${errorData.error}`, {
                    position: "top-right",
                    autoClose: 4000,
                });
            }
        } catch (error) {
            console.error(error);
            toast.error('🔌 Erro ao conectar ao servidor', {
                position: "top-right",
                autoClose: 3000,
            });
        }
    };


    const handleLogout = () => {
        removeAuthTokenFromCookies();
        setIsLoggedIn(false);
        toast.success('👋 Logout realizado com sucesso!', {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });

        // Adicionar delay para mostrar o toast antes de redirecionar
        setTimeout(() => {
            navigate('/');
        }, 2000);
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

            <MuiThemeProvider theme={muiTheme}>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    maxWidth={false}
                    fullWidth={false}
                    PaperProps={{
                        style: {
                            borderRadius: 18,
                            boxShadow: '0 8px 32px rgba(44,62,80,0.18)',
                            border: '2px solid var(--primary)',
                            padding: 0,
                            background: theme === 'dark' ? '#1a1a1a' : '#ffffff',
                            width: isRegister ? '70vw' : '400px',
                            maxWidth: isRegister ? '70vw' : '400px',
                            minWidth: '320px',
                        }
                    }}>

                    <DialogTitle
                        style={{
                            textAlign: 'center',
                            color: 'var(--primary)',
                            fontWeight: 'bold',
                            fontSize: '1.6rem',
                            letterSpacing: 1,
                            borderBottom: theme === 'dark' ? '1px solid #333' : '1px solid #eee',
                            paddingBottom: 12,
                            position: 'relative',
                            backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
                        }}
                    >
                        {isRegister ? 'Registro' : 'Login'}
                        <IconButton aria-label="close" onClick={handleClose} style={{ position: 'absolute', right: 8, top: 8, color: 'var(--primary)' }}>
                            <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>×</span>
                        </IconButton>
                    </DialogTitle>

                    <DialogContent
                        style={{
                            backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
                            padding: '32px 24px 12px 24px',
                            minWidth: 320,
                            display: 'flex',
                            flexDirection: isRegister ? 'row' : 'column',
                            gap: isRegister ? 24 : 12,
                            flexWrap: isRegister ? 'wrap' : 'nowrap',
                        }}
                    >
                        {isRegister ? (
                            <div style={{ display: 'flex', width: '100%', gap: '24px' }}>
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <TextField
                                        label="Usuário"
                                        fullWidth
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        autoFocus
                                    />

                                    <TextField
                                        label="Email"
                                        fullWidth
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />

                                    <TextField
                                        label="Nome Completo"
                                        fullWidth
                                        value={full_name}
                                        onChange={(e) => setFullName(e.target.value)}
                                    />

                                    <FormControl component="fieldset">
                                        <FormLabel component="legend">Gênero</FormLabel>
                                        <RadioGroup
                                            value={gender}
                                            onChange={(e) => setGender(e.target.value)}
                                            row
                                        >
                                            <FormControlLabel value="masculino" control={<Radio />} label="Masculino" />
                                            <FormControlLabel value="feminino" control={<Radio />} label="Feminino" />
                                        </RadioGroup>
                                    </FormControl>
                                </div>

                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <TextField
                                        label="Idade"
                                        type="number"
                                        fullWidth
                                        value={age}
                                        onChange={(e) => setAge(e.target.value)}
                                    />

                                    <TextField
                                        label="Peso (kg)"
                                        type="number"
                                        fullWidth
                                        value={weight}
                                        onChange={(e) => setWeight(e.target.value)}
                                    />

                                    <TextField
                                        label="Altura (cm)"
                                        type="number"
                                        fullWidth
                                        value={height}
                                        onChange={(e) => setHeight(e.target.value)}
                                    />

                                    <TextField
                                        label="Senha"
                                        fullWidth
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                        ) : (
                            <>
                                <TextField
                                    label="Usuário"
                                    fullWidth
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    autoFocus
                                    style={{ marginBottom: 16 }}
                                />
                                <TextField
                                    label="Senha"
                                    fullWidth
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    style={{ marginBottom: 8 }}
                                />
                            </>
                        )}

                        {isRegister && (
                            <div style={{ width: '100%', marginTop: '16px' }}>
                                <FormControl component="fieldset" style={{ width: '100%' }}>
                                    <FormLabel component="legend" style={{ marginBottom: 10 }}>
                                        Nível de Atividade Física
                                    </FormLabel>
                                    <RadioGroup
                                        value={activity_level}
                                        onChange={(e) => setActivityLevel(e.target.value)}
                                        style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
                                    >
                                        <FormControlLabel
                                            value="sedentary"
                                            control={<Radio />}
                                            label={
                                                <div>
                                                    <strong style={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}>Sedentário</strong>
                                                    <p style={{
                                                        margin: 0,
                                                        fontSize: '0.9rem',
                                                        color: theme === 'dark' ? '#cccccc' : '#666666'
                                                    }}>
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
                                                    <strong style={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}>Atividade Leve</strong>
                                                    <p style={{
                                                        margin: 0,
                                                        fontSize: '0.9rem',
                                                        color: theme === 'dark' ? '#cccccc' : '#666666'
                                                    }}>
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
                                                    <strong style={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}>Moderado</strong>
                                                    <p style={{
                                                        margin: 0,
                                                        fontSize: '0.9rem',
                                                        color: theme === 'dark' ? '#cccccc' : '#666666'
                                                    }}>
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
                                                    <strong style={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}>Ativo</strong>
                                                    <p style={{
                                                        margin: 0,
                                                        fontSize: '0.9rem',
                                                        color: theme === 'dark' ? '#cccccc' : '#666666'
                                                    }}>
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
                                                    <strong style={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}>Muito Ativo</strong>
                                                    <p style={{
                                                        margin: 0,
                                                        fontSize: '0.9rem',
                                                        color: theme === 'dark' ? '#cccccc' : '#666666'
                                                    }}>
                                                        Atividade física extremamente intensa, como treinos profissionais ou trabalhos físicos exigentes.
                                                    </p>
                                                </div>
                                            }
                                        />
                                    </RadioGroup>
                                </FormControl>
                            </div>
                        )}

                    </DialogContent>

                    <DialogActions
                        style={{
                            justifyContent: 'center',
                            paddingBottom: 18,
                            backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
                            borderTop: theme === 'dark' ? '1px solid #333' : '1px solid #eee',
                        }}
                    >

                        {isRegister ? (

                            <>

                                <Button

                                    onClick={handleRegister}

                                    color="primary"

                                    style={{

                                        backgroundColor: 'var(--primary)',

                                        color: theme === 'dark' ? '#ffffff' : '#ffffff',

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

                                        color: theme === 'dark' ? '#ffffff' : '#ffffff',

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
            </MuiThemeProvider>

            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme={theme === 'dark' ? 'dark' : 'light'}
                style={{
                    fontSize: '14px',
                    fontFamily: 'Poppins, sans-serif'
                }}
            />

        </>

    );

}

export default Header;