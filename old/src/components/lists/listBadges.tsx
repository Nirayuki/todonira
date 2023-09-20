import React, { Dispatch, SetStateAction, useState, ChangeEvent } from 'react';

import { Input, Button, ColorPicker } from 'antd';
import { DeleteOutlined, PlusOutlined, SmileOutlined } from '@ant-design/icons';
import type { Color, ColorPickerProps } from 'antd/es/color-picker';

interface Props {
    data: ItemBadge[],
    setData: Dispatch<SetStateAction<ItemBadge[]>>,
    isCreate: boolean,
    setIsCreate: Dispatch<SetStateAction<boolean>>
}

interface RoomData {
    isPrivate: boolean,
    password: string,
    categoria: [],
    badges: []
}

interface ItemBadge {
    title: string,
    color: Color | string
}

export const ListBadges = ({ data, setData, isCreate, setIsCreate }: Props) => {

    const [createInput, setCreateInput] = useState<string>("");
    const [color, setColor] = useState<Color | string>("#008000");
    const [formatHex, setFormatHex] = useState<ColorPickerProps['format']>('hex');
    const [status, setStatus] = useState<"" | "warning" | "error" | undefined>(undefined);

    const handleChange = (e: ChangeEvent<HTMLInputElement>, key: number) => {
        const updateData: ItemBadge[] = [...data];
        updateData[key].title = e.currentTarget.value;

        setData(updateData);
    }


    const handleChangePicker = (e: Pick<Color, "toHsb" | "toHsbString" | "toHex" | "toHexString" | "toRgb" | "toRgbString">, key: number) => {
        const updateData: ItemBadge[] = [...data];
        updateData[key].color = e.toHexString();
        setData(updateData);
    }

    const handleChangePickerCreate = (e: Pick<Color, "toHsb" | "toHsbString" | "toHex" | "toHexString" | "toRgb" | "toRgbString">) => {
        setColor(e.toHexString());
    }

    const handleCriar = () => {
        if (createInput === "") {
            setStatus("error");
        } else {
            setData(data ? (data) => [...data, { title: createInput, color: color }] : [{ title: createInput, color: color }]);
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
                        <div className="title-edit-list-modal">Criar uma nova Marcação</div>
                        <div className="content-edit-list-modal">
                            <Input status={status} value={createInput} placeholder='Digite uma nova marcação aqui...' onChange={(e) => setCreateInput(e.currentTarget.value)} allowClear />
                            <ColorPicker
                                format={formatHex}
                                value={color}
                                onChange={(e) => handleChangePickerCreate(e)}
                                onFormatChange={setFormatHex}
                            />
                        </div>
                    </div>
                    <div className="buttons">
                        <Button onClick={() => setIsCreate(false)}>
                            Voltar
                        </Button>
                        <Button type='primary' onClick={() => handleCriar()}>
                            Criar Marcação
                        </Button>
                    </div>
                </>
            ) : (
                <>
                    <div className="button">
                        <Button type='primary' icon={<PlusOutlined />} onClick={() => setIsCreate(true)}>
                            Criar Marcação
                        </Button>
                    </div>
                    <div className="list-badge">
                        {
                            data ? data.map((item: ItemBadge, key: number) => {
                                return (
                                    <div className="item-list">
                                        <Input key={key} defaultValue={item.title} onChange={(e) => handleChange(e, key)} />
                                        <ColorPicker
                                            defaultValue={item.color}
                                            format={formatHex}
                                            onChange={(e) => handleChangePicker(e, key)}
                                            onFormatChange={setFormatHex}
                                        />
                                        <Button type="text" icon={<DeleteOutlined />} onClick={() => handleDelete(key)}>
                                        </Button>
                                    </div>
                                )
                            }) : (
                                <div className="no-data">
                                    <SmileOutlined style={{ fontSize: 20 }} />
                                    <p>Sem Marcações</p>
                                </div>
                            )
                        }
                    </div>
                </>
            )}
        </div>
    )
}