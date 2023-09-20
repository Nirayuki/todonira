import React, { useState, Dispatch, SetStateAction} from 'react';

import { Modal, Input, ColorPicker } from "antd";
import type { Color, ColorPickerProps } from 'antd/es/color-picker';

import { DocumentData } from 'firebase/firestore';

import '../../style/modalNewBadge.css';
import roomService from '../../services/room.service';

interface Props {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>,
    data: RoomData | undefined | DocumentData,
}

interface RoomData {
    isPrivate: boolean,
    password: string,
    categoria: [],
    badges: []
}

export const ModalNewBadge = ({open, setOpen, data} : Props) => {

    const [input, setInput] = useState<string>("");
    const [color, setColor] = useState<Color | string | undefined>("#00913f");
    const [status, setStatus] = useState<"" | "warning" | "error" | undefined>(undefined);

    const [formatHex, setFormatHex] = useState<ColorPickerProps['format']>('hex');

    const handleCancel = () => {
        setOpen(false);
        setStatus(undefined)
        setInput("");
        setColor("#00913f");
    }

    const handleOk = async () => {
        setStatus(undefined);
        if(input){
            await roomService.addBadge(data, {title: input, color: color});
            setOpen(false);
            setStatus(undefined)
            setInput("");
            setColor("#00913f");
        }else{
            setStatus("error");
        }
    }

    return(
        <Modal
            title="Nova Badge"
            open={open}
            onCancel={handleCancel}
            onOk={handleOk}
        >
            <div className="content-modalnewbadge">
                <Input placeholder='Nova badge...' status={status} value={input} onChange={(e) => setInput(e.currentTarget.value)}/>
                <ColorPicker
                    format={formatHex}
                    value={color}
                    onChange={(e) => setColor(e.toHexString())}
                    onFormatChange={setFormatHex}
                />
            </div>
        </Modal>
    )
}