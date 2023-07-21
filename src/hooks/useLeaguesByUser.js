import { useQuery } from 'react-query';
import axios from 'axios';


function useLeaguesByUser(user) {
  return useQuery(['userLeagues', user.id], async () => {
    const response = await axios.get(`https://gridiron-java-c95bfe4c87da.herokuapp.com/api/league/all-for-user`, {
      headers: {
        'Authorization': `Bearer ${user.accessToken}`
      }
    });
    
    // TODO better error handling
    if (response.status !== 200) {
      throw new Error('Error fetching leagues');
    }
    
    return response.data;
  });
}

export default useLeaguesByUser;