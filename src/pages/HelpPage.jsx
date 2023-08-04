import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import {useState} from "react";
import {createHelpTicket} from "../utils/api.js";
import {successAlert} from "../utils/ToastAlerts.js";

const HelpPage = () => {
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage ] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        createHelpTicket(email, subject, message);
        successAlert('Request sent');
        setEmail('');
        setSubject('');
        setMessage('');
    }

    return (
        <Box component="form"
             onSubmit={handleSubmit}
             display={'flex'}
             flexDirection={'column'}
             sx={{
                 height: '100vh',
                 width: '80%',
                 padding: 3
             }}
        >
            <TextField
                margin="normal"
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{
                    width:'500px',
                    maxWidth: '90vw'
                }}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                name="subject"
                label="Subject"
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                sx={{
                    width:'500px',
                    maxWidth: '90vw'
                }}
            />
            <TextField
                margin="normal"
                required
                name="message"
                label="Message"
                id="message"
                multiline
                rows={8}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                sx={{
                    width: '90vw'
                }}
            />
            <Button
                type="submit"
                variant="contained"
                sx={{ mt: 3, mb: 2, width: '90vw', maxWidth: '300px' }}
            >
                Send
            </Button>

        </Box>
    )
}

export default HelpPage;