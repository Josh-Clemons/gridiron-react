import Box from "@mui/material/Box";
import {Button, Typography} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack.js";
import {useNavigate} from "react-router-dom";

const AboutPage = () => {

    const navigate = useNavigate();

    return (
        <>
            <Box p={3} sx={{minHeight: '100vh'}}>
                <Typography variant={'h3'}>
                    Please enjoy Grid Iron Picks!
                </Typography>
                <br/>
                <Typography variant={'h6'}>
                    Did you find a bug? Email gridironpickem@outlook.com
                </Typography>
                <br/>
                <br/>
                <Typography variant={'body1'}>
                    A big thanks to Mark Swan for coming up with the idea for Grid Iron and running it for over 15 years with just email and spreadsheets!
                </Typography>
                <br/>
                <br/>
                <Button variant="outlined" onClick={() => navigate(-1)} size='small' sx={{
                    width: 125,
                    m: 1,
                    borderWidth: 2,
                    '&:hover': {borderWidth: '2px'}
                }}>Back<ArrowBackIcon sx={{ml: 2}}/></Button>
            </Box>
        </>
    )
}

export default AboutPage;