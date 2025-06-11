interface User {
    id: number;
    username: string;
    isAdmin?: boolean;
}


export const getToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
};

export const getUser = (): User | null => {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
};

export const isAuthenticated = (): boolean => {
    return !!getToken();
};

export const logout = (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
}; 