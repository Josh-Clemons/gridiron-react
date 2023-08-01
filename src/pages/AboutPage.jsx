import Box from "@mui/material/Box";
import {Typography} from "@mui/material";

const AboutPage = () => {

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
            </Box>
        </>
    )
}

export default AboutPage;