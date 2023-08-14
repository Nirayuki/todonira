import React, { useState, Dispatch, SetStateAction, useEffect, ChangeEvent } from 'react';

import { Modal, ColorPicker, Input, Button } from 'antd';
import type { Color, ColorPickerProps } from 'antd/es/color-picker';

import { DocumentData } from 'firebase/firestore';

import { DeleteOutlined } from '@ant-design/icons';

import roomService from '../../services/room.service';

import '../../style/modalBadges.css';

interface Props {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>,
    data: RoomData | undefined | DocumentData,
    setBadge: Dispatch<SetStateAction<string | undefined>>,
    dataBadges: ItemBadgs[],
    setDataBadges: Dispatch<SetStateAction<ItemBadgs[]>>
}

interface RoomData {
    isPrivate: boolean,
    password: string,
    categoria: [],
    badges: []
}

interface ItemBadgs {
    title: string,
    color: string   
}

export const ModalBadges = ({ open, setOpen, data, setBadge, dataBadges, setDataBadges }: Props) => {
    const [input, setInput] = useState<string | undefined>();
    const [color, setColor] = useState<Color | string | undefined>();
    const [formatHex, setFormatHex] = useState<ColorPickerProps['format']>('hex');

    const handleOk = async () => {
        await roomService.updateBadge(dataBadges);
        setOpen(false);
        setBadge(undefined);
    }

    const handleCancel = () => {
        setColor(undefined);
        setInput(undefined);
        setOpen(false);
    }

    const handleChangeInput = (e: ChangeEvent<HTMLInputElement>, key: number) => {
        const updateData: ItemBadgs[] = [...dataBadges];
        updateData[key].title = e.currentTarget.value;

        setDataBadges(updateData);
    }

    const handleChangePicker = (e: Pick<Color, "toHsb" | "toHsbString" | "toHex" | "toHexString" | "toRgb" | "toRgbString">, key: number) => {
        const updateData: ItemBadgs[] = [...dataBadges];
        updateData[key].color = e.toHexString();
        setDataBadges(updateData);
    }

    const handleDelete = (key: number) => {
        const updatedData = dataBadges.filter((_, index) => index !== key);
        setDataBadges(updatedData);
    }

    return (
        <Modal
            open={open}
            title="Configurações das Badges"
            onOk={handleOk}
            onCancel={handleCancel}
        >
            <div className="modal-badges">
                {
                    dataBadges ? dataBadges.map((item: ItemBadgs, key: number) => {
                        return (
                            <div className='list-badges' key={key}>
                                <div className="content-list">
                                    <Input placeholder='Digite um badge aqui...' defaultValue={item.title} value={input} onChange={(e) => handleChangeInput(e, key)} />
                                    <ColorPicker 
                                        defaultValue={item.color} 
                                        format={formatHex}
                                        value={color}
                                        onChange={(e) => handleChangePicker(e, key)}
                                        onFormatChange={setFormatHex}
                                    />
                                </div>
                                <div className="delete">
                                    <Button type="text" icon={<DeleteOutlined />} onClick={() => handleDelete(key)}>
                                    </Button>
                                </div>
                            </div>
                        )
                    }) : null
                }
            </div>
        </Modal>
    )
}