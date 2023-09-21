'use client'
import {ReactNode, createContext, useCallback, useEffect,useContext, useState, Dispatch, SetStateAction } from 'react';

const AuthContext = createContext<{user: any, handleLogout: () => void, getUser: () => void,setUser: Dispatch<SetStateAction<any>>} | null>(null);

export const AuthProvider = ({children}: {children: ReactNode }) => {
    const [user, setUser] = useState<any>();
    
    useEffect(() => {
        const userStorage = localStorage.getItem("user");
    
        if(userStorage){
            setUser(JSON.parse(userStorage));
        }else{
            setUser(null);
        }
    }, []);

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem("user");
    }

    const getUser = () => {
        const userStorage = localStorage.getItem("user");
    
        if(userStorage){
            setUser(JSON.parse(userStorage));
        }else{
            setUser(null);
        }
    }

    return(
        <AuthContext.Provider value={{user, setUser, handleLogout, getUser}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuthContext = () => useContext(AuthContext);