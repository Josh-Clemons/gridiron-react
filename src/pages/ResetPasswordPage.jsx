import { useParams } from "react-router-dom";

// External Libraries
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Contexts
import { UserContext } from "../contexts/UserContext";
import { ThreeCircles } from "react-loader-spinner";


const ResetPasswordPage = () => {
    const { accessCode, email } = useParams();
    // Hooks
    const navigate = useNavigate();
    const { resetPassword, resetPasswordLoading } = useContext(UserContext)
    const [password, setPassword] = useState('');
    const [passwordCheck, setPasswordCheck] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Functions
    const handleSubmit = async (event) => {
        event.preventDefault();
        await resetPassword(email, password, accessCode).then(()=>{
            navigate('/login');
        }).catch((error) => {
            setErrorMessage(error.toString());
        });
    };

    if (resetPasswordLoading) {
        return (
            <Box width={'100vw'} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh', mt: 5 }}>
                <ThreeCircles
                    type="ThreeDots"
                    color="#5BC0BE"
                    height={100}
                    width={100}
                />
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
                <Avatar sx={{ m: 1, bgcolor: 'primary', width: 56, height: 56 }}>
                    {/* update this icon */}
                    <LockOpenIcon sx={{ fontSize: "30px" }} />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Reset Password
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="passwordCheck"
                        label="Re-Type Password"
                        type="password"
                        id="passwordCheck"
                        value={passwordCheck}
                        onChange={(e) => setPasswordCheck(e.target.value)}
                    />
                    {errorMessage && <div>{errorMessage}</div>}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Reset Password
                    </Button>
                    <Grid container>
                        <Grid item>
                            <Link onClick={() => navigate('/login')} variant="body1" sx={{ '&:hover': { cursor: "pointer" } }}>
                                {"Already have an account? Sign in."}
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
}

export default ResetPasswordPage;