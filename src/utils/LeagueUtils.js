export function checkIsLeagueOwner(picks, user) {
    if(picks?.length > 0) {
        return picks[0]?.league?.leagueOwner === user.username;
    }
    return false;
}

export function checkIsLeagueMember(picks, user) {
    if(picks?.length > 0) {
        return picks?.some(pick => pick.owner.id === user.id);
    }

    return false;
}

export function findCurrentWeek(competitors) {
    const delayToSwitchWeeks = 3 * 24 * 60 * 60 * 1000;
    const currentDate = new Date();
    const dateWithDelay = new Date(currentDate.getTime() - delayToSwitchWeeks);

    let nextGameStart;
    let week = 1;

    if(competitors) {
        for(let competitor of competitors) {
            const startDate = new Date(competitor.startDate);
            if((!nextGameStart && startDate > dateWithDelay) ||
                (startDate < nextGameStart) && (startDate > dateWithDelay)) {
                nextGameStart = startDate;
                week = competitor.week;
            }
        }
    }
    return week;
}
