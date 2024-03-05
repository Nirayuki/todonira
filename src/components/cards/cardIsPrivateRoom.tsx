import React, { useState, useContext, Dispatch, SetStateAction } from 'react';

import { Card, Input, Checkbox, Button } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';

import { ThemeContext } from '../../theme/ThemeContext';
import { DocumentData } from 'firebase/firestore';

interface Props {
    data: RoomData | DocumentData | undefined,
    setIsPrivateRoom: Dispatch<SetStateAction<boolean>>
}

interface RoomData {
    isPrivate: boolean,
    password: string,
    categoria: [],
    badges: []
}

export const CardIsPrivateRoom = ({data, setIsPrivateRoom} : Props) => {

    const { theme } = useContext(ThemeContext);

    const [error, setError] = useState<"" | "warning" | "error" | undefined>("");
    const [input, setInput] = useState<string>("");
    const [alwaysLogged, setAlwaysLogged] = useState<boolean>(false);

    const handleKeyEntrar = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' && data?.password.trim() !== "") {
            setIsPrivateRoom(false);
        }
    }

    const handleAlwaysLoggedIn = (e: CheckboxChangeEvent) => {
        setAlwaysLogged(e.target.checked);
    }

    const handleEntrar = () => {
        if (data?.password === input) {
            if (alwaysLogged) {
                const path = window.location.pathname.substring(1);
                localStorage.setItem(path, input);
                setError(undefined);
                setIsPrivateRoom(false);
            } else {
                setError(undefined);
                setIsPrivateRoom(false);
            }
        } else {
            setError("error");
        }
    }

    return (
        <Card className='card' bordered={theme === "light" ? true : false} style={{ width: 350 }}>
            <div className='title'>
                Room Privada
            </div>
            <div className="passw">
                <Input.Password placeholder='Digite sua senha aqui...' onKeyDown={handleKeyEntrar} status={error} value={input} onChange={(e) => setInput(e.currentTarget.value)} />
            </div>
            <div className="check">
                <Checkbox onChange={(e) => handleAlwaysLoggedIn(e)} />
                <p>Me manter logado</p>
            </div>
            <Button type="primary" onClick={(e) => handleEntrar()}>Entrar</Button>
        </Card>
    )
}