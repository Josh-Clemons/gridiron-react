import {Button} from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';
import Papa from 'papaparse';
import PropTypes from 'prop-types';

const DownloadPicksButton = ({picks}) => {
    console.log(picks);
    const simplifiedPicks = picks.map(pick => ({
        user: pick.owner.username,
        week: pick.week,
        value: pick.value,
        team: pick.competitor?.team?.abbreviation
    }));

    const handleDownload = () => {
        const csvContent = Papa.unparse(simplifiedPicks);
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
        <Button color="success" onClick={handleDownload}
                sx={{m: 1, borderWidth: 2,
                    alignSelf: 'flex-end',
                    '&:hover': {borderWidth: '2px'},
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