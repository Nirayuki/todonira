import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

import { Layout } from '../components/layout';
import { CardHomeFancy } from '../components/cardHomeFancy';

import { Card, Checkbox, Button, Modal, Input } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';

import { EyeFilled, EyeInvisibleFilled, EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons';

import roomService from '../services/room.service';

import '../style/home.css';


interface RoomData {
    isPrivate: boolean,
    isPublica: boolean,
    password?: string
}

interface Checks {
    private: boolean,
    publica: boolean
}

const initialChecks: Checks = {
    private: false,
    publica: true
}

function Home() {

    const [open, setOpen] = useState<boolean>(false);

    const [dataInput, setDataInput] = useState<string>("");
    const [checks, setChecks] = useState<Checks>(initialChecks);
    const [error, setError] = useState<"error" | undefined>(undefined);

    const navigate = useNavigate();
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        function handleResize() {
            setWidth(window.innerWidth);
        }

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, []);

    const handleOpen = () => {
        setOpen(true);
    }

    const handleOk = async () => {
        setError(undefined);
        if(dataInput === "" && !checks.publica){
            setError("error");
            return
        }else{
            const roomData: RoomData = {
                isPrivate: checks.private,
                isPublica: checks.publica,
                password: dataInput.trim(),
            }
            const roomId = await roomService.createRoom(roomData);
            navigate(`/${roomId}`);
            setOpen(false);
        }
    }

    const handleCancel = () => {
        setOpen(false);
        setDataInput("");
        setChecks(initialChecks)
    }

    return (
        <Layout hasChildren={false}>
            <Modal
                title="Criar uma sala"
                open={open}
                onCancel={handleCancel}
                footer={[
                    <Button type='primary' onClick={() => handleOk()}>
                        Criar sala
                    </Button>
                ]}
                width="400px"
            >
                <div className="modal-content">
                    <Checkbox
                        checked={checks.publica}
                        onChange={(e) => {
                            setChecks({ publica: e.target.checked, private: false })
                        }}
                    >

                        Pública
                    </Checkbox>
                    <Checkbox
                        checked={checks.private}
                        onChange={(e) => {
                            setChecks({ publica: false, private: e.target.checked })
                        }}
                    >
                        Privada
                    </Checkbox>
                </div>
                {checks.private ? (
                    <Input.Password 
                        placeholder='Digite sua senha aqui...'
                        value={dataInput}
                        status={error}
                        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                        onChange={(e) => setDataInput(e.currentTarget.value)}
                    />
                ) : null}
            </Modal>
            <div className="home">
                {width < 379 ? (
                    <div className="nira" style={{ textAlign: "start", width: "95%" }}>
                        <a href='https://nirayuki.netlify.app/' target='_blank'>@ Nirayuki</a>
                    </div>
                ) : null}
                <CardHomeFancy handleOpen={handleOpen} />
            </div>
        </Layout>
        //     <Card className='card' bordered={theme === "light" ? true : false} style={{ width: 350 }}>
        //     <div className='title'>
        //         Criar Todo Room
        //     </div>
        //     <div className="checks">
        //         <Checkbox className='check' checked={isPrivate} onChange={onChangeBox}>
        //             Privada
        //         </Checkbox>
        //     </div>
        //     {isPrivate ? <div className="passw">
        //         <input type={showPassword ? "text" : "password"} placeholder='Senha' onChange={onChange} value={dataInput} />
        //         {showPassword ? <EyeFilled className='icon eye' onClick={(e) => setShowPassword(false)} /> : <EyeInvisibleFilled className='icon eye' onClick={(e) => setShowPassword(true)} />}
        //     </div> :
        //         ""}
        //     <Button type="primary" onClick={() => generateRoom()}>Criar Room</Button>
        // </Card>
    )
}

export default Home;
