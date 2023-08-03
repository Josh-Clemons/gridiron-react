// Libraries
import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { errorAlert, successAlert } from '../../utils/ToastAlerts';

const style = {
  position: 'absolute',
  top: '20%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '95%',
  maxWidth: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const ForgotPasswordButton = () => {

  const [email, setEmail] = useState('');
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    handleClose();
    await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/email/password-reset-request?email=${email}`)
      .then(() => {
        successAlert("Email Sent");
      }).catch(() => {
        errorAlert("Error resetting");
      })
  };

  return (
    <Box>
      <Grid container>
              <Grid item>
                <Link onClick={handleOpen} variant="body1" sx={{ '&:hover': { cursor: "pointer" } }}>
                  {"Forgot password?"}
                </Link>
              </Grid>
            </Grid>
      <Modal
        open={open}
        onClose={handleClose}
      >
        <Box sx={style} component='form' onSubmit={handleSubmit}>
          <Typography id="inviteCodeTitle" variant="h6" component="h2">
            Password Reset Request
          </Typography>
          <TextField
            required
            autoFocus
            id="emailInput"
            label="Email"
            placeholder="gridiron@example.com"
            onChange={(e) => setEmail(e.target.value)}
            sx={{
              backgroundColor: 'black',
              margin: 2.5,
              marginTop: 4,
              width: '95%'
            }}
          />
          <Stack spacing={1} direction='row-reverse'>
            <Button variant='outlined' color={'success'} onClick={handleSubmit} sx={{ width: 80 }}>Request</Button>
            <Button variant='outlined' color={'error'} onClick={handleClose} sx={{ width: 80 }}>Cancel</Button>
          </Stack>
        </Box>
      </Modal>
    </Box>
  );
}

export default ForgotPasswordButton;