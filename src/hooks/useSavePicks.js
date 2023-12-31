import { useContext } from "react";
import { useMutation, useQueryClient } from "react-query";
import { UserContext } from "../contexts/UserContext";
import axios from 'axios';
import { errorAlert, successAlert } from "../utils/ToastAlerts";

function useSavePicks() {
    const queryClient = useQueryClient();
    const { user } = useContext(UserContext);

    return useMutation((picks) => axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/pick/update`, picks, {
        headers: {
            'Authorization': `Bearer ${user.accessToken}`
        }
    }), {
        onError: (error) => {
            errorAlert("Error saving picks...");
        },
        onSuccess: (data) => {
            successAlert("Saved!")
            queryClient.invalidateQueries('leaguePicks');
            return data;
        }
    })
}

export default useSavePicks;