// Libraries
import { useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// Contexts
import { UserContext } from '../../contexts/UserContext';
import { ThreeCircles } from "react-loader-spinner";
import ForgotPasswordButton from '../Buttons/ForgotPasswordButton';

export default function LoginForm() {
    // Hooks
    const navigate = useNavigate();
    const { state } = useLocation();
    const { signIn, signOut, signinLoading } = useContext(UserContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);

    // Functions
    const errorEmptyFields = () => {
        setErrorMessage('Complete all fields');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        signOut()
        // continue only if user/email are not blank
        if (username !== '' && password !== '') {
            await signIn(username, password).then(() => {
                navigate(state?.from || '/dashboard');
            }).catch((e) => {
                setErrorMessage(e.message);
            })
        } else {
            errorEmptyFields();
        }
    };

    if (!errorMessage && signinLoading) {
        return (
            <Box width={'100vw'} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh', mt: 5 }}>
                <ThreeCircles
                    type="ThreeDots"
                    color="#5BC0BE"
                    height={100}
                    width={100}
                />
                <Typography variant={"h6"}>This may take up to 30 seconds...</Typography>
            </Box>
        );
    }

    return (
        <Container component="main" maxWidth="xs">

            <Box
                minHeight={'100vh'}
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'green', width: 56, height: 56 }}>
                    <LockOutlinedIcon sx={{ fontSize: "30px" }} />
                </Avatar>
                <Typography component="h1" variant="h4">
                    Sign in
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="email"
                        autoFocus
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {errorMessage && <div>{errorMessage}</div>}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign In
                    </Button>
                    <Grid container>
                        <Grid item xs={12}>
                            <Link onClick={() => navigate('/register')} variant="body1" sx={{ '&:hover': { cursor: "pointer" } }}>
                                {"Don't have an account? Register"}
                            </Link>
                        </Grid>
                        <Grid item>
                            <ForgotPasswordButton />
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
}