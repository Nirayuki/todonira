'use client'
import { useState, useEffect } from 'react';
import './styles/gerenciar.css';
import { useAuthContext } from '@/components/authContext';
import { useRouter } from 'next/navigation';
import userService from '@/services/user.service';
import Skeleton from '@/components/Skeleton';

import { AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';
import { Modal } from '@/components/Modal';

export default function Gerenciar() {
    const auth = useAuthContext();
    const [data, setData] = useState<any[]>();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [modal, setModal] = useState(false);

    const [idItem, setIdItem] = useState("");
    const [loadDelete, setLoadDelete] = useState(false);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            if (auth?.user) {
                console.log("caindo aq")
                const res: any = await userService.getUser(auth?.user.id);

                setData(res.listas);
                setLoading(false);
            }
        }

        fetchData();
    }, [auth?.user]);

    const onCancel = () => {
        setModal(false);
    }

    const onOk = () => {
        setLoadDelete(true);
        setModal(false);
    }

    return (
        <>
            <Modal 
                open={modal}
                onCancel={onCancel}
                onOk={onOk}
            >
                <p>Deseja mesmo excluir?</p>
            </Modal>
            <div className="container-gerenciar">

                <h3 className="title">Gerenciar Listas</h3>
                <div className="line"></div>
                <div className="list-listas">
                    {loading && (
                        <>
                            <Skeleton width='100%' height='30px' />
                            <Skeleton width='100%' height='30px' />
                            <Skeleton width='100%' height='30px' />
                            <Skeleton width='100%' height='30px' />
                            <Skeleton width='100%' height='30px' />
                        </>
                    )}
                    {!loading && data?.map((item, key) => {
                        return (
                            <div className="item-lista">
                                <p className='title-list'>{item.title}</p>
                                <div className="editar"><AiOutlineEdit /></div>
                                <div className="excluir" onClick={() => {
                                    setModal(true);
                                    setIdItem(item.id);
                                }}><AiOutlineDelete /></div>
                            </div>
                        )
                    }).reverse()}
                </div>
            </div>
        </>

    )
}