import { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config/baseUrl';

const useCheckLogin = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [checkingLogin, setCheckingLogin] = useState(true);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const checkLogin = async () => {
            try {
                const response = await axios.get(`${config}/api-auth/check-login`, { headers: { Authorization: token } });
                setIsLoggedIn(response.data.isLoggedIn);
            } catch (error) {
                console.error('Error checking login status:', error);
            } finally {
                setCheckingLogin(false);
            }
        };

        checkLogin();
    }, []);

    return { isLoggedIn, checkingLogin };
};

export default useCheckLogin;