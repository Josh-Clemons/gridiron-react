import axios from 'axios';
import PropTypes from 'prop-types';
import { createContext, useContext, useEffect, useState } from 'react';
import { useQuery } from 'react-query';

import { UserContext } from './UserContext';

export const CompetitorContext = createContext();

export const CompetitorProvider = ({ children }) => {
    // Contexts
    const { user } = useContext(UserContext);

    // State to track if the user has signed in successfully
    const [hasSignedIn, setHasSignedIn] = useState(false);

    // Functions
    const fetchCompetitors = async () => {
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/gamedata/competitors`, {
            headers: {
                'Authorization': `Bearer ${user.accessToken}`
            }
        })
        return data;
    }

    // Query
    const { data: competitors, isError, error, isLoading, refetch } = useQuery('competitors', fetchCompetitors, {
        refetchOnWindowFocus: false,
        enabled: hasSignedIn, // Only fetch when hasSignedIn is true
    });

    // Use useEffect to set hasSignedIn when signIn is successful
    useEffect(() => {
        if (user && user.accessToken) {
            setHasSignedIn(true);
        }
    }, [user]);


    return (
        <CompetitorContext.Provider value={{ competitors, isError, error, isLoading, refetch }}>
            {children}
        </CompetitorContext.Provider>
    )
}

CompetitorProvider.propTypes = {
    children: PropTypes.node,
}
