import { Dispatch, SetStateAction, useState } from 'react'
import { Modal, Button } from "antd";
import { DocumentData } from 'firebase/firestore';

import { ListCategorias } from '../lists/listCategorias';
import { ListBadges } from '../lists/listBadges';
import type { Color } from 'antd/es/color-picker';

import '../../style/modalSettings.css';
import roomService from '../../services/room.service';
import { LoadingOutlined } from '@ant-design/icons';

interface Props {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>,
    data: RoomData | DocumentData | undefined,
    setData: Dispatch<SetStateAction<RoomData | DocumentData | undefined>>,
    dataCategoria: string[],
    setDataCategoria: Dispatch<SetStateAction<string[]>>,
    dataBadges: ItemBadge[],
    setDataBadges: Dispatch<SetStateAction<ItemBadge[]>>
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

export const ModalSettings = ({ open, setOpen, data, setData, dataCategoria, dataBadges, setDataCategoria, setDataBadges }: Props) => {
    const [path, setPath] = useState<string>("categorias");
    const [isCreateCategoria, setIsCreateCategoria] = useState<boolean>(false);
    const [isCreateBadge, setIsCreateBadge] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const handleCancel = () => {
        setOpen(false);
    }

    const handleSubmit = async () => {
        setLoading(true);
        await roomService.updateRoomCategoriaBadge(dataCategoria, dataBadges);
        setLoading(false);
        setOpen(false);
    }

    return (
        <Modal
            open={open}
            onCancel={handleCancel}
            footer={null}
            width={700}
            className='settings-modal'
        >
            <div className="settings-modal">
                <div className="header-modal">
                    <span style={{ backgroundColor: path === "categorias" ? "rgba(0, 0, 0, 0.10)" : undefined }} onClick={() => {
                        setPath("categorias");
                        setIsCreateBadge(false);
                        setIsCreateCategoria(false);
                    }}>Categorias</span>
                    <span style={{ backgroundColor: path === "marcações" ? "rgba(0, 0, 0, 0.10)" : undefined }} onClick={() => {
                        setPath("marcações");
                        setIsCreateBadge(false);
                        setIsCreateCategoria(false);
                    }}>Marcações</span>
                </div>
                <div className="content-modal">
                    {path === "categorias" ? (
                        <ListCategorias
                            data={dataCategoria}
                            setData={setDataCategoria}
                            isCreate={isCreateCategoria}
                            setIsCreate={setIsCreateCategoria}
                        />
                    ) : (
                        <ListBadges
                            data={dataBadges}
                            setData={setDataBadges}
                            isCreate={isCreateBadge}
                            setIsCreate={setIsCreateBadge}
                        />
                    )}
                </div>
                {isCreateBadge || isCreateCategoria ? null : (
                    <div className="buttons">
                        <Button onClick={() => setOpen(false)}>
                            Cancelar
                        </Button>
                        <Button type='primary' icon={loading ? <LoadingOutlined/> : undefined} onClick={() => handleSubmit()}>
                            Salvar
                        </Button>
                    </div>
                )}
            </div>
        </Modal>
    )
}