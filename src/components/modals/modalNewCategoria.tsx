import { Dispatch, SetStateAction, useState } from "react";

import { Modal, Input } from "antd";

import roomService from "../../services/room.service";
import { DocumentData } from "firebase/firestore";

interface Props {
    data: RoomData | DocumentData | undefined,
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>,
    setCategoriaInput: Dispatch<SetStateAction<string>>
}

interface RoomData {
    isPrivate: boolean,
    password: string,
    categoria: [],
    badges: []
}

export const ModalNewCategoria = ({data, open, setOpen, setCategoriaInput} : Props) => {

    const [input, setInput] = useState<string>("");

    const handleOk = async () => {
        if (input !== "") {
            await roomService.addRoomCategoria(input, data);
            setOpen(false);
            setCategoriaInput(input);
            setInput("");
        } else {
            setOpen(false);
        }

    };

    const handleCancel = () => {
        setOpen(false);
    };
    return (
        <Modal
            open={open}
            title="Nova categoria"
            onOk={handleOk}
            onCancel={handleCancel}
        >
            <Input className='input-categoria' placeholder='Nova categoria' value={input} onChange={(e) => setInput(e.currentTarget.value)} />
        </Modal>
    )
}