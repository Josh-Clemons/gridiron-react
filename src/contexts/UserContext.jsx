import { createContext, useState } from 'react';
import { useMutation } from 'react-query';
import axios from 'axios';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const cookie = Cookies.get('user');
        return cookie ? JSON.parse(cookie) : null;
    });
    const [token, setToken] = useState(user?.accessToken);

    const signinMutation = useMutation(({ username, password }) => axios
        .post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/signin`, { username, password }), {
        onSuccess: (data) => {
            setUser(data.data);
            setToken(data.data.accessToken);
            Cookies.set('user', JSON.stringify(data.data), { expires: 30, secure: true });
            return data.data;
        },
        onError: (error) => {
            return error;
        }
    })
    const { isLoading: signinLoading } = signinMutation;

    const signupMutation = useMutation(({ username, email, password }) => {
        const credentials = { username, password };

        return axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/signup`, { username, email, password })
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

    const resetPasswordMutation = useMutation(({ email, newPassword, accessCode }) => {
            const credentials = {email, newPassword};
            return axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/auth/reset`,
                { email, newPassword, accessCode})
                .then((data) => {
                    return {...data, credentials};
                });
        }, {
            onSuccess: async (data) => {
                await signIn(data.credentials.email, data.credentials.newPassword);
            },
            onError: (error) => {
                throw error;
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
        Cookies.remove('user');
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