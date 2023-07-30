import { createContext, useState } from 'react';
import { useMutation } from 'react-query';
import axios from 'axios';
import PropTypes from 'prop-types';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(() => JSON.parse(sessionStorage.getItem('user')));
    const [token, setToken] = useState(user?.accessToken);

    const signinMutation = useMutation(({ username, password }) => axios
        .post(`https://gridiron-java-c95bfe4c87da.herokuapp.com/api/auth/signin`, { username, password }), {
        onSuccess: (data) => {
            setUser(data.data);
            setToken(data.data.accessToken);
            sessionStorage.setItem('user', JSON.stringify(data.data));
            return data.data;
        },
        onError: (error) => {
            console.log(error)
            return error;
        }
    })
    const { isLoading: signinLoading } = signinMutation;

    const signupMutation = useMutation(({ username, email, password }) => {
        const credentials = { username, password };

        return axios.post(`https://gridiron-java-c95bfe4c87da.herokuapp.com/api/auth/signup`, { username, email, password })
            .then((data) => {
                return { ...data, credentials };  // Return data and credentials together.
            }).catch((error) => {
                throw new Error(error.response?.data?.message);
            });
    }, {
        onSuccess: async (data) => {
            try {
                await signIn(data.credentials.username, data.credentials.password);
            } catch (error) {
                console.log('Error signing in after signup: ', error);
            }
        },
    });
    const { isLoading: signupLoading } = signupMutation;

    const resetPasswordMutation = useMutation(({ email, newPassword, accessCode }) => axios
        .put(`https://gridiron-java-c95bfe4c87da.herokuapp.com/api/auth/reset`, { email, newPassword, accessCode}), {
            onSuccess: (data) => {
                return data.data;
            },
            onError: (error) => {
                console.log(error);
                return error;
            }
        }
    );
    const { isLoading: resetPasswordLoading} = resetPasswordMutation;


    const signIn = (username, password) => {
        return signinMutation.mutateAsync({ username, password });
    }

    const signUp = (username, email, password) => {
        return signupMutation.mutateAsync({ username, email, password });
    }

    const resetPassword = (email, newPassword, accessCode) => {
        return resetPasswordMutation.mutateAsync({ email, newPassword, accessCode});
    }

    const signOut = () => {
        sessionStorage.setItem('user', null);
        setUser(null);
        setToken(null);
    }

    return (
        <UserContext.Provider value={{ 
            user, token, signIn, signOut, signUp, resetPassword, 
            signinLoading, signupLoading, resetPasswordLoading 
        }}>
            {children}
        </UserContext.Provider>
    );
};

UserProvider.propTypes = {
    children: PropTypes.node,
};