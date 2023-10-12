import { Button } from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';
import Papa from 'papaparse';
import PropTypes from 'prop-types';

const DownloadPicksButton = ({ picks }) => {
    // Sort the picks array as per your requirements
    const sortedPicks = picks.sort((a, b) => {
        if (a.owner.username < b.owner.username) return -1;
        if (a.owner.username > b.owner.username) return 1;
        if (a.week < b.week) return -1;
        if (a.week > b.week) return 1;
        if (a.value > b.value) return -1;
        if (a.value < b.value) return 1;
        return 0;
    });

    const userDataMap = new Map();

    sortedPicks.forEach(pick => {
        const user = pick.owner.username;
        const week = pick.week;
        const value = pick.value;
        const abbreviation = pick.competitor?.team?.abbreviation;

        if (!userDataMap.has(user)) {
            userDataMap.set(user, { username: user });
        }

        userDataMap.get(user)[`Week ${week} Value ${value}`] = abbreviation;
    });

    const userDataArray = Array.from(userDataMap.values());

    // Convert userDataArray to CSV format
    const csvContent = Papa.unparse(userDataArray);

    // Function to download the CSV
    const handleDownload = () => {
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;

        let leagueName = picks[0]?.league?.leagueName;
        leagueName = leagueName.replace(/\s/g, "-");
        leagueName = leagueName.replace(/[^\w-]/g, "");

        const date = new Date();
        const formattedDate = `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`;
        link.setAttribute('download', `${leagueName}-picks-${formattedDate}.csv`);

        link.click();
    };

    return (
        <Button
            color="success"
            onClick={handleDownload}
            sx={{
                m: 1,
                borderWidth: 2,
                alignSelf: 'flex-end',
                '&:hover': { borderWidth: '2px' },
            }}
        >
            League Picks
            <DownloadIcon />
        </Button>
    );
}

DownloadPicksButton.propTypes = {
    picks: PropTypes.array
}

export default DownloadPicksButton;