// Libraries
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { useNavigate } from 'react-router-dom';
import { Typography } from '@mui/material';

const LeagueItem = ({ league }) => {
    // Hooks
    const navigate = useNavigate();

    // Functions
    const leagueClick = (league) => {
        navigate(`/league-detail/${league.inviteCode}`);
    };

    return (
        <Box
            component={Paper}
            elevation={20}
            display={"flex"}
            flexDirection={"row"}
            alignContent={"center"}
            onClick={() => leagueClick(league)}
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mt: 2,
                mb: 2,
                "&:hover": {
                    cursor: 'pointer',
                },
            }}
        >
            <Typography variant='h6' sx={{flexGrow: 1, p: 1, pl: 3}}>
                {league.leagueName}
            </Typography>
            <Typography variant='body2' sx={{p: 1, pr: 3}}>
                Users: {league.userCount}/{league.maxUsers}
            </Typography>

        </Box>
    );
};

LeagueItem.propTypes = {
    league: PropTypes.object,
};

export default LeagueItem;
