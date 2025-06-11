import { config } from '@/config';

interface User {
    id: number;
    username: string;
}

interface LoginResponse {
    token: string;
    user: User;
}

export const login = async (username: string, password: string): Promise<LoginResponse> => {
    const response = await fetch(`${config.apiBaseUrl}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Login failed');
    }

    return response.json();
};

export const register = async (username: string, password: string): Promise<void> => {
    const response = await fetch(`${config.apiBaseUrl}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Registration failed');
    }
};
