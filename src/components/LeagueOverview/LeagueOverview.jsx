// Libraries
import { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { NativeSelect, FormControl } from '@mui/material';
import { UserContext } from '../../contexts/UserContext';
import { StyledTableRow } from '../../styles/SharedStyles';
import DownloadPicksButton from "../Buttons/DownloadPicksButton.jsx";
import {checkIsLeagueOwner, findCurrentWeek} from "../../utils/LeagueUtils.js";
import {CompetitorContext} from "../../contexts/CompetitorContext.jsx";

const LeagueOverview = ({ picks }) => {
    // Hooks
    const { user } = useContext(UserContext);
    const {competitors} = useContext(CompetitorContext);
    const [weeklyPicks, setWeeklyPicks] = useState([]);
    const [isLeagueOwner, setIsLeagueOwner] = useState(false);
    const [defaultWeek, setDefaultWeek] = useState(1);

    useEffect(()=> {
        setIsLeagueOwner(checkIsLeagueOwner(picks, user))
    }, [picks])

    useEffect(()=> {
        setDefaultWeek(findCurrentWeek(competitors));
    }, [competitors])

    useEffect(() => {
        setWeeklyPicks(getPicksByWeek(defaultWeek, picks, user));
    }, [defaultWeek, picks, user])

    const handleWeekChange = (event) => {
        const week = Number(event.target.value);
        setDefaultWeek(week);
        setWeeklyPicks(getPicksByWeek(week, picks, user));
    }

    const weekOptions = [...generateWeekOptions()].map(option =>
        <option key={option.value} value={option.value}>{option.label}</option>
    );

    function generateWeekOptions() {
        let options = [];

        for (let i = 1; i <= 18; i++) {
            options.push({value: i, label: i.toString()});
        }

        return options;
    }

    function getPicksByWeek(week, picks, user) {
        const picksByWeek = picks.filter(pick => pick.week === week);
        let results = [];

        picksByWeek.forEach(pick => {
            const owner = pick.owner.username;
            let index = results.findIndex(item => item.owner === owner);

            if (index === -1) {
                results.push({
                    owner: owner,
                    valueOne: "-",
                    isOneWinner: false,
                    isOneComplete: false,
                    valueThree: "-",
                    isThreeWinner: false,
                    isThreeComplete: false,
                    valueFive: "-",
                    isFiveWinner: false,
                    isFiveComplete: false,
                    weeklyScore: 0,
                });
                index = results.length - 1;
            }

            if (pick.competitor && pick.competitor.team) {
                const team = pick.competitor.team.abbreviation;

                const startDate = new Date(pick.competitor.startDate)
                const now = new Date();
                // only show other players picks if the start date/time is before now
                if (now > startDate || pick.owner.username === user.username) {
                    if (results[index]) {

                        let increment;
                        switch (pick.value) {
                            case 1:
                                results[index].valueOne = team;
                                results[index].isOneWinner = pick.competitor.winner;
                                results[index].isOneComplete = pick.competitor.completed;
                                increment = 1;
                                break;
                            case 3:
                                results[index].valueThree = team;
                                results[index].isThreeWinner = pick.competitor.winner;
                                results[index].isThreeComplete = pick.competitor.completed;
                                increment = 3;
                                break;
                            case 5:
                                results[index].valueFive = team;
                                results[index].isFiveWinner = pick.competitor.winner;
                                results[index].isFiveComplete = pick.competitor.completed;
                                increment = 5;
                                break;
                            default:
                                break;
                        }

                        if (pick.competitor.winner && increment) {
                            results[index].weeklyScore += increment;
                        }
                    }
                }
            }
        });

        // add 2 bonus points if a user has all 3 selections correct in the given week
        for (let result of results) {
            if (result.isOneWinner && result.isThreeWinner && result.isFiveWinner) {
                result.weeklyScore += 2;
            }
        }

        // sorting the array by username in alphabetical order
        results.sort((a, b) => a.owner.localeCompare(b.owner));

        return results;
    }


    const getBorderStyle = (isWinner, isComplete) => {
        if(isComplete) {
            return isWinner ? "1px solid green" : "1px solid darkred";
        }
        return "1px solid rgba(0,0,0,0)";
    };

    return (
        <Box width={"100%"} sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            {isLeagueOwner && <DownloadPicksButton picks={picks}/>}
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
            }}
            >
                <Typography variant='h6' sx={{mr: 3}}>Week: </Typography>
                <FormControl variant="filled" style={{width: '100px'}}>
                    <NativeSelect value={defaultWeek}
                        onChange={handleWeekChange}
                    >
                        {weekOptions}
                    </NativeSelect>
                </FormControl>
            </Box>
            <Typography sx={{fontSize: 12, fontStyle: 'italic'}}>
                Other user's picks available after game starts
            </Typography>
            <Box width={'100%'} mb={'80px'}>
                <TableContainer component={Paper} sx={{marginTop: '20px'}}>
                    <Table size='small' sx={{width: '100%'}}>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{padding: '6px', maxWidth: '30vw'}}>User</TableCell>
                                <TableCell sx={{padding: '6px', pl: 3}}>5 Pts</TableCell>
                                <TableCell sx={{padding: '6px', pl: 3}}>3 Pts</TableCell>
                                <TableCell sx={{padding: '6px', pl: 3}}>1 Pt</TableCell>
                                <TableCell sx={{padding: '6px', pl: 1}}>Score</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {weeklyPicks && weeklyPicks.map((pick, i) => {
                                return (
                                    <StyledTableRow key={i}>
                                        <TableCell sx={{pl: 1, pr: 1, maxWidth: '30vw'}}>
                                            <Typography variant='body1' noWrap={true}>{pick.owner}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Box
                                                border={getBorderStyle(pick.isFiveWinner, pick.isFiveComplete)}
                                                borderRadius={1}
                                                p={.5}
                                            >
                                                {pick.valueFive}
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box
                                                border={getBorderStyle(pick.isThreeWinner, pick.isThreeComplete)}
                                                borderRadius={1}
                                                p={.5}
                                            >
                                                {pick.valueThree}
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box
                                                border={getBorderStyle(pick.isOneWinner, pick.isOneComplete)}
                                                borderRadius={1}
                                                p={.5}
                                            >
                                                {pick.valueOne}
                                            </Box>
                                        </TableCell>
                                        <TableCell>{pick.weeklyScore}</TableCell>
                                    </StyledTableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    )
}

LeagueOverview.propTypes = {
    picks: PropTypes.array,
    competitors: PropTypes.array
}

export default LeagueOverview;
