import { Dispatch, SetStateAction, useState, ChangeEvent } from "react";

import { Modal, List, Button, Input } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

import roomService from "../../services/room.service";

interface Props{
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>,
    dataSettings: string[],
    setDataSettings: Dispatch<SetStateAction<string[]>>,
    categoriaInput: string,
    setCategoriaInput: Dispatch<SetStateAction<string>>
    categoria: string,
    setCategoria: Dispatch<SetStateAction<string>>
}

export const ModalCategoriaSettings = ({
    open, 
    setOpen, 
    dataSettings, 
    setDataSettings, 
    categoriaInput,
    categoria,
    setCategoria,
    setCategoriaInput
}: Props) => {

    const handleOk = async () => {
        if (dataSettings.includes(categoriaInput)) {
            if (categoriaInput === categoria) {
                setCategoria("all");
                setCategoriaInput("");
            }else{
                setCategoriaInput("");
            }
        }
        await roomService.updateCategoria(dataSettings);
        setOpen(false);
    }

    const handleCancel = () => {
        setOpen(false);
    }

    const handleDelete = (key: number) => {
        const updatedSettings = dataSettings.filter((_, index) => index !== key);
       
        setDataSettings(updatedSettings);
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>, key: number) => {
        const updateSettings: string[] = [...dataSettings];
        updateSettings[key] = e.currentTarget.value;

        setDataSettings(updateSettings);
    }

    return (
        <Modal
            open={open}
            title="Configuração Categorias"
            onOk={handleOk}
            onCancel={handleCancel}
        >
            <List
                itemLayout="horizontal"
                dataSource={dataSettings}
                renderItem={(item, key) => {
                    return (
                        <List.Item
                            actions={[<Button type="text" icon={<DeleteOutlined />} onClick={() => handleDelete(key)}>
                            </Button>]}
                        >
                            <Input value={item} key={key} onChange={(e) => handleChange(e, key)} />
                        </List.Item>
                    )
                }}
            />
        </Modal>
    )
}