import { useState } from 'react';
import axios from 'axios';
import config from '../config/baseUrl';

const useLogin = (onClose: () => void) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(`${config}/api-auth/login`, { username, password });
            if (response.status === 200) {
                localStorage.setItem('token', response.data.token);
                onClose();
                window.location.reload();
            }
        } catch (error) {
            setError('Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return {
        username,
        setUsername,
        password,
        setPassword,
        loading,
        error,
        handleLogin,
    };
};

export default useLogin;
