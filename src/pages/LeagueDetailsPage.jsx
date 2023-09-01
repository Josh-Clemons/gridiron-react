// Libraries
import {useContext, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {useQuery} from "react-query";
import {Box, ButtonGroup, Button, Typography} from '@mui/material';

// Components
import LeagueStandings from "../components/LeagueStandings/LeagueStandings.jsx";
import LeagueDetails from "../components/LeagueDetails/LeagueDetails";
import PickSelections from "../components/PickSelections/PickSelections";
import LeagueOverview from "../components/LeagueOverview/LeagueOverview";
import {ThreeCircles} from "react-loader-spinner";

// APIs
import {fetchLeagueDetails} from "../utils/api.js";

// Contexts
import {UserContext} from "../contexts/UserContext";

// Hooks
import useLeaguePicks from "../hooks/useLeaguePicks";
import useScrollToTop from "../hooks/useScrollToTop.js";
import {checkIsLeagueMember, checkIsLeagueOwner} from "../utils/LeagueUtils.js";


const LeagueDetailsPage = () => {
    // Parameters
    const {inviteCode} = useParams();

    // Context
    const {user} = useContext(UserContext);

    // Hooks
    useScrollToTop();
    const {data: picks, isLoadingPicks} = useLeaguePicks(inviteCode);
    const {data: leagueDetails} = useQuery(
        ['leagueDetails', {accessToken: user.accessToken, inviteCode}],
        fetchLeagueDetails,
        {refetchOnWindowFocus: false}
    );

    // State Variables
    const [myPicks, setMyPicks] = useState();
    const [leagueScores, setLeagueScores] = useState([]);
    const [isLeagueOwner, setIsLeagueOwner] = useState(false);
    const [isLeagueMember, setIsLeagueMember] = useState(false);
    const [viewState, setViewState] = useState('standings');

    useEffect(() => {
        let leagueScores = [];
        const usernames = Array.from(
            new Set(
                picks?.map((pick) => pick.owner.username)
            )
        );
        for (let username of usernames) {
            const tempUserPicks = picks.filter(pick => pick.owner.username === username)
            let score = 0;
            let weekPicks = new Map();

            // Organize picks by week
            for (let pick of tempUserPicks) {
                let week = pick?.competitor?.week;
                if (week) {
                    if (!weekPicks.has(week)) {
                        weekPicks.set(week, []);
                    }
                    weekPicks.get(week).push(pick);
                }
            }

            // Calculate scores and apply bonus
            for (let [week, picks] of weekPicks.entries()) {
                let allWinners = picks.every(pick => pick?.competitor?.winner);

                if (allWinners && picks.length === 3) {
                    let weekScore = picks.reduce((total, pick) => total + pick.value, 0);
                    score += weekScore + 2;
                } else {
                    let weekScore = picks.filter(pick => pick?.competitor?.winner).reduce((total, pick) => total + pick.value, 0);
                    score += weekScore;
                }
            }
            leagueScores.push({username: username, score: score});
        }

        // Sorting the leagueScores array based on the score
        leagueScores.sort((a, b) => b.score - a.score);

        setLeagueScores(leagueScores);

        setMyPicks(picks?.filter(pick => pick.owner.id === user.id).map(pick => {
            return ({
                id: pick.id,
                ownerId: user.id,
                team: pick.competitor ? pick.competitor.team.abbreviation : "",
                event: pick.competitor ? pick.competitor.eventId : "",
                leagueId: pick.league?.id,
                value: pick.value,
                week: pick.week,
                startDate: pick.competitor ? pick.competitor.startDate : "",
                isWinner: pick.competitor ? pick.competitor.winner : false
            })
        }));

        setIsLeagueOwner(checkIsLeagueOwner(picks, user));
        setIsLeagueMember(checkIsLeagueMember(picks, user));

    }, [picks, user.id, user.username])

    useEffect(() => {
       console.log("myPicks:", myPicks, "\npicks:", picks);
    }, [myPicks]);


    if (isLoadingPicks) {
        return (
            <Box sx={{display: 'flex', height: '100vh', mt: 5}}>
                <ThreeCircles
                    type="ThreeDots"
                    color="#5BC0BE"
                    height={100}
                    width={100}
                />
                <Typography variant={"h6"}>This may take up to 30 seconds...</Typography>
            </Box>
        )
    }

    return (
        <Box minHeight={'100vh'} m={.5} pb={15} display={'flex'} flexDirection={'column'} alignItems={'center'}>
            <LeagueDetails isMember={isLeagueMember} isOwner={isLeagueOwner} leagueDetails={leagueDetails}/>
            {/*Button group is for selecting the component being rendered on league details page*/}
            <ButtonGroup
                variant="text"
                aria-label="text button group"
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    width: '90%',
                    maxWidth: 600,
                    mt: 2,
                    mb: 2,
                }}
            >
                <Button onClick={() => setViewState('standings')} sx={{width: '30%'}}>Standings</Button>
                {(isLeagueMember || isLeagueOwner) &&
                    <Button onClick={() => setViewState('Picks')} sx={{width: '30%'}}>Picks</Button>}
                {(isLeagueMember || isLeagueOwner) &&
                    <Button onClick={() => setViewState('overview')} sx={{width: '30%'}}>Overview</Button>}

            </ButtonGroup>

            <Box p={1} width={'100%'} maxWidth={'700px'} display={'flex'} flexDirection={'column'}
                 alignItems={'center'}>
                {/* Shows a different component contingent on the choice the user makes, starts at league standings */}
                {viewState === 'standings' && <LeagueStandings leagueScores={leagueScores}/>}
                {viewState === 'Picks' &&
                    <PickSelections picks={myPicks} setPicks={setMyPicks} leagueScores={leagueScores}/>}
                {/*{(viewState === 'Picks' && isLeagueOwner) && <PicksCommissioner />}*/}
                {viewState === 'overview' && <LeagueOverview picks={picks}/>}
            </Box>
        </Box>
    )
}

export default LeagueDetailsPage;