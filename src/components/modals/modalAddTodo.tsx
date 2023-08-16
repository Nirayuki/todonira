import {Dispatch, SetStateAction} from 'react'
import { Button, Input, Modal } from "antd";

import '../../style/modalAddTodo.css';
import { DocumentData } from 'firebase/firestore';

import todoService from '../../services/todo.service';

interface Props{
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>,
    dataInput: string,
    children: JSX.Element[] | JSX.Element | string,
    setDataInput: Dispatch<SetStateAction<string>>,
    dataPrivateRoom: RoomData | undefined | DocumentData,
    categoriaInput: string,
    setCategoriaInput: Dispatch<SetStateAction<string>>,
    badge: string | undefined,
    setBadge: Dispatch<SetStateAction<string | undefined>>
}

interface RoomData {
    isPrivate: boolean,
    password: string,
    categoria: [],
    badges: []
}

interface TodoItem {
    id?: string | null | number;
    text: string;
    completed: boolean;
    categoria?: string | [],
    badge?: {
        title: string,
        color: string
    } | null
}

interface ItemBadge {
    title: string,
    color: string
}

export const ModalAddTodo = ({open, setOpen, dataInput, setDataInput, children, dataPrivateRoom, setCategoriaInput, categoriaInput, setBadge, badge}: Props) => {

    const handleOk = async () => {
        const badgeObject: ItemBadge[] = dataPrivateRoom?.badges.filter((filter: { title: string }) => filter.title === badge);
        const newItem: TodoItem = {
            text: dataInput,
            completed: false,
            categoria: categoriaInput ? categoriaInput : [],
            badge: badge ? {
                title: badgeObject[0].title,
                color: badgeObject[0].color
            } : null,
        };

        await todoService.addTodo(newItem);
        setDataInput("");
        setCategoriaInput("");
        setBadge("");
        setOpen(false);
    }

    const handleCancel = () => {
        setOpen(false);
    }

    return(
        <Modal
            title="Adicionar Tarefa"
            open={open}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={[
                <Button key="back" onClick={handleCancel}>
                    Cancelar
                </Button>,
                <Button key="submit" type='primary' onClick={handleOk}>
                    Criar Tarefa
                </Button>
            ]}
        >
            <Input.TextArea value={dataInput} onChange={(e) => setDataInput(e.currentTarget.value)} bordered={false} style={{resize: "none", fontSize: "1.2rem", padding: "0", borderBottom: "2px solid rgba(0, 0, 0, 0.4)", borderRadius: "0"}} maxLength={150} autoSize/>
            <div className="others">
                {children}
            </div>
        </Modal>
    )
}