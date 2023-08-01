import React, { useState, useContext } from 'react';
import { Layout } from '../components/layout';
import { Card, Checkbox, Button } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons';
import roomService from '../services/room.service';
import { useNavigate } from "react-router-dom";
import '../style/home.css';
import { ThemeContext } from '../theme/ThemeContext';

interface RoomData {
    isPrivate: boolean,
    password?: string
}

function Home() {

    const { theme } = useContext(ThemeContext);

    const [isPrivate, setIsPrivate] = useState<boolean>(false)
    const [dataInput, setDataInput] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const navigate = useNavigate();

    const onChangeBox = (e: CheckboxChangeEvent) => {
        setIsPrivate(e.target.checked);
    }

    const onChange = (e: React.FormEvent<HTMLInputElement>) => {
        setDataInput(e.currentTarget.value);
    }

    const generateRoom = async () => {
        const newData: RoomData = {
            isPrivate: isPrivate
        }

        const newDataPrivate: RoomData = {
            isPrivate: isPrivate,
            password: dataInput,
        }

        const roomId = await roomService.createRoom(isPrivate ? newDataPrivate : newData);
        navigate(`/${roomId}`);
    }

    return (
        <Layout>
            <Card className='card' bordered={theme === "light" ? true : false} style={{ width: 350 }}>
                <div className='title'>
                    Criar Todo Room
                </div>
                <div className="checks">
                    <Checkbox className='check' checked={isPrivate} onChange={onChangeBox}>
                        Privada
                    </Checkbox>
                </div>
                {isPrivate ? <div className="passw">
                    <input type={showPassword ? "text" : "password"} placeholder='Senha' onChange={onChange} value={dataInput} />
                    {showPassword ? <EyeFilled className='icon eye' onClick={(e) => setShowPassword(false)} /> : <EyeInvisibleFilled className='icon eye' onClick={(e) => setShowPassword(true)} />}
                </div> :
                    ""}
                <Button type="primary" onClick={() => generateRoom()}>Criar Room</Button>
            </Card>
        </Layout>
    )
}

export default Home;
