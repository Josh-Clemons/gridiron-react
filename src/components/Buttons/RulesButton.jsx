/* eslint-disable react/no-unescaped-entities */
// Libraries
import React from 'react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import GavelIcon from '@mui/icons-material/Gavel';
import Modal from '@mui/material/Modal';
import PropTypes from 'prop-types';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '95%',
    maxWidth: 600,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 2,
};

const RulesButton = ({ size, width, variant, margin }) => {

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => { setOpen(false) };


    return (
        <Box>
            <Button variant={variant} onClick={handleOpen} color={'secondary'} size={size} sx={{ width: { width }, margin: { margin }, borderWidth: 2, '&:hover': { borderWidth: '2px' } }}>Rules<GavelIcon sx={{ ml: 2 }} /></Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Rules:
                    </Typography>
                    <Typography variant='body1' paragraph={true} style={{ width: '95%', height: '60vh', overflow: 'auto' }}>
                        Each week, pick 3 different teams to win their games, ignoring point spreads. Assign each a point value: 5, 3, or 1. You earn these points if the team wins.
                        <br />
                        <br />
                        For example, choosing IND (5), BAL (3), GB (1) and having the Colts and Packers win would score 6 points (5+1). A clean sweep (all 3 teams winning) adds a 2-point bonus, netting 11 points total.
                        <br />
                        <br />
                        Teams can't be picked for the same point category more than once per season. For instance, the Colts can be a 5-point choice just once. Make your selections before game time or score no points, and note Thursday games need earlier picks.
                        <br />
                        <br />
                        Other rules:
                        <br />
                        -Ties count as losses.
                        <br />
                        -You can't pick both teams from the same game.
                        <br />
                    </Typography>
                    <Stack spacing={1} direction='row-reverse'>
                        <Button variant='outlined' color={'primary'} onClick={handleClose} sx={{ width: 80 }}>Close</Button>
                    </Stack>
                </Box>
            </Modal>
        </Box>
    );
}

RulesButton.propTypes = {
  size : PropTypes.string,
  width : PropTypes.number,
  variant : PropTypes.string,
  margin : PropTypes.number
}

export default RulesButton;