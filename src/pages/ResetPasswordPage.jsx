import { useParams } from "react-router-dom";

// External Libraries
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Container from '@mui/material/Container';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Contexts
import { UserContext } from "../contexts/UserContext";
import { passwordValidator } from "../utils/PasswordUtils";


const ResetPasswordPage = () => {
    const { accessCode, email } = useParams();
    // Hooks
    const navigate = useNavigate();
    const { resetPassword } = useContext(UserContext)
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [validPassword, setValidPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        passwordCheck();
    }, [password1, password2])

    // Functions
    const handleSubmit = async (event) => {
        event.preventDefault();
        await resetPassword(email, password1, accessCode).then(() => {
            navigate('/dashboard');
        }).catch((error) => {
            setErrorMessage(error.response?.data);
        });
    };

    const passwordCheck = () => {
        if (password1 === password2 && password1 !== '') {
            setValidPassword(passwordValidator(password1));
        } else {
            setValidPassword(false);
        }

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
                <Box component="form"
                     onSubmit={handleSubmit}
                     noValidate
                     sx={{ mt: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                >
                    <TextField
                        margin="normal"
                        required
                        name="password1"
                        label="Password"
                        type="password"
                        id="password1"
                        value={password1}
                        onChange={(e) => setPassword1(e.target.value)}
                        sx={{ width: '90vw', maxWidth: '400px'}}
                    />
                    <Box display='flex' flexDirection='row' alignItems='center'>
                        <Typography variant="body-2" pr="3px">
                            Must be at least 6 characters
                        </Typography>
                        {password1.length > 0 &&
                            (passwordValidator(password1) ?
                                <CheckCircleOutlineIcon color={'success'} /> :
                                <ErrorOutlineIcon color={'error'} />)
                        }
                    </Box>

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password2"
                        label="Re-Type Password"
                        type="password"
                        id="password2"
                        value={password2}
                        onChange={(e) => setPassword2(e.target.value)}
                        sx={{ width: '90vw', maxWidth: '400px'}}
                    />
                    {errorMessage && <div>{errorMessage}</div>}
                    <Button
                        type="submit"
                        disabled={!validPassword}
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Reset Password
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}

export default ResetPasswordPage;