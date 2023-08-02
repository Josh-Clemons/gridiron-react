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