import React, { useState, useEffect } from 'react';
import { Layout } from '../components/layout';
import { Card, Checkbox, Button } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons';
import roomService from '../services/room.service';
import { useNavigate } from "react-router-dom";
import { HomeDetails } from '../style/homeDetails';

interface RoomData {
    isPrivate: boolean,
    password?: string
}

function Home() {

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
            <HomeDetails>
                <Card bordered={true} style={{ width: 350 }}>
                    <div className='title'>
                        Criar Todo Room
                    </div>
                    <div className="checks">
                        <Checkbox checked={isPrivate} onChange={onChangeBox}>
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
            </HomeDetails>
        </Layout>
    )
}

export default Home;
