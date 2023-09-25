'use client'
import { ReactNode, createContext, useCallback, useEffect, useContext, useState, Dispatch, SetStateAction } from 'react';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userStorage = localStorage.getItem("user");

        if (userStorage) {
            setUser(JSON.parse(userStorage));
        } else {
            setUser(null);
        }

        setLoading(false);
    }, []);

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem("user");
    }

    const getUser = () => {
        const userStorage = localStorage.getItem("user");
        if (userStorage) {
            setUser(JSON.parse(userStorage));
        } else {
            setUser(null);
        }
    }

    return (
        // <>
        //     {typeof window !== 'undefined' && (
        //         <AuthContext.Provider value={{ user, loading, setUser, handleLogout, getUser }}>
        //             {children}
        //         </AuthContext.Provider>
        //     )}
        // </>
        <AuthContext.Provider value={{ user, loading, setUser, handleLogout, getUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuthContext = () => useContext(AuthContext);