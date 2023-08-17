import React, { useState, Dispatch, SetStateAction, ChangeEvent } from 'react';

import { Button, Input } from 'antd';
import { DeleteOutlined, PlusOutlined, SmileOutlined } from '@ant-design/icons';
import { DocumentData } from 'firebase/firestore';

interface Props {
    data: string[],
    setData: Dispatch<SetStateAction<string[]>>,
    isCreate: boolean,
    setIsCreate: Dispatch<SetStateAction<boolean>>
}

interface RoomData {
    isPrivate: boolean,
    password: string,
    categoria: [],
    badges: []
}


export const ListCategorias = ({ data, setData, isCreate, setIsCreate }: Props) => {
    const [createInput, setCreateInput] = useState<string>("");
    const [status, setStatus] = useState<"" | "warning" | "error" | undefined>(undefined);

    const handleChange = (e: ChangeEvent<HTMLInputElement>, key: number) => {
        const updateSettings: string[] = [...data];
        updateSettings[key] = e.currentTarget.value;

        setData(updateSettings);
    }

    const handleCreateCategoria = () => {
        if (createInput === "") {
            setStatus("error");
        } else {
            setData(data ? (data) => [...data, createInput] : [createInput]);
            setIsCreate(false);
            setCreateInput("");
        }
    }

    const handleDelete = (key: number) => {
        const updatedSettings = data.filter((_, index) => index !== key);

        setData(updatedSettings);
    }

    return (
        <div className="list-content">
            {isCreate ? (
                <>
                    <div className="edit-list-modal">
                        <div className="title-edit-list-modal">Criar uma nova Categoria</div>
                        <Input status={status} value={createInput} placeholder='Digite uma nova categoria aqui...' onChange={(e) => setCreateInput(e.currentTarget.value)} allowClear />
                    </div>
                    <div className="buttons">
                        <Button onClick={() => setIsCreate(false)}>
                            Voltar
                        </Button>
                        <Button type='primary' onClick={() => handleCreateCategoria()}>
                            Criar Categoria
                        </Button>
                    </div>
                </>


            ) : (
                <>
                    <div className="button">
                        <Button type='primary' icon={<PlusOutlined />} onClick={() => setIsCreate(true)}>
                            Criar Categoria
                        </Button>
                    </div>
                    <div className="list-categorias">
                        {
                            data ? data.map((item: string, key: number) => {
                                return (
                                    <div className="item-list">
                                        <Input key={key} defaultValue={item} onChange={(e) => handleChange(e, key)} />
                                        <Button type="text" icon={<DeleteOutlined />} onClick={() => handleDelete(key)}>
                                        </Button>
                                    </div>
                                )
                            }) : (
                                <div className="no-data">
                                    <SmileOutlined style={{ fontSize: 20 }} />
                                    <p>Sem Categorias</p>
                                </div>
                            )
                        }
                    </div>
                </>
            )}
        </div>
    )
}