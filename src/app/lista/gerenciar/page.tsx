'use client'
import { useState, useEffect } from 'react';
import './styles/gerenciar.css';
import { useAuthContext } from '@/components/authContext';
import { useRouter } from 'next/navigation';
import userService from '@/services/user.service';
import Skeleton from '@/components/Skeleton';

import { AiOutlineEdit, AiOutlineDelete, AiOutlineWarning } from 'react-icons/ai';
import { Modal } from '@/components/Modal';
import listaService from '@/services/lista.service';
import { Pagination } from '@/components/Pagination';

export default function Gerenciar() {
    const auth = useAuthContext();
    const [data, setData] = useState<any>();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [modal, setModal] = useState(false);
    const [modalEdit, setModalEdit] = useState(false);

    const [idItem, setIdItem] = useState("");
    const [dataEdit, setDataEdit] = useState<any>();
    const [editInput, setEditInput] = useState("");
    const [error, setError] = useState(false);
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

    async function fetchData() {
        if (auth?.user) {
            const res: any = await userService.getUser(auth?.user.id);
            setData(res.listas);
        }
    }

    const onCancel = () => {
        setModal(false);
    }

    const onOk = async () => {
        setLoadDelete(true);
        const res = await listaService.deleteLista(idItem);

        if (res) {
            fetchData();
        }

        setLoadDelete(false);
        setModal(false);
    }

    const onEdit = async () => {
        setLoadDelete(true);
        if(!editInput){
            setError(true);
        }
        
        if(editInput){
            const res = await listaService.updateLista({id: dataEdit.id, title: editInput});
            
            if(res){
                fetchData();
            }
        }

        setLoadDelete(false);
        setModalEdit(false);
    }

    const onEditCancel = () => {
        setModalEdit(false);
    }

    return (
        <>
            <Modal
                open={modalEdit}
                onCancel={onEditCancel}
                onOk={onEdit}
                width={600}
                footer={(
                    <>
                        <button className='back' onClick={() => onEditCancel()}>Cancelar</button>
                        <button className='ok' onClick={() => onEdit()}>
                            {loadDelete && (<span className="loader" style={{
                                width: "15px",
                                height: "15px",
                                borderColor: "white",
                                borderBottomColor: "transparent"
                            }}></span>)}
                            {!loadDelete && ("Editar")}
                        </button>
                    </>
                )}
            >
                <div className="title">Editar Lista</div>
                <div className="form">
                    <div className="label">Nome da Lista</div>
                    <input type="text" value={editInput} onKeyDown={(e) => {
                        if(e.key === "Enter"){
                            onEdit();
                        }
                    }} onChange={((e) => setEditInput(e.currentTarget.value))}/>
                    {error && <p className='error'><AiOutlineWarning/> O campo "nome da lista" não pode estar em branco</p>}
                </div>
            </Modal>
            <Modal
                open={modal}
                onCancel={onCancel}
                onOk={onOk}
                footer={(
                    <>
                        <button className='back' onClick={() => onCancel()}>Não</button>
                        <button className='ok' onClick={() => onOk()}>
                            {loadDelete && (<span className="loader" style={{
                                width: "15px",
                                height: "15px",
                                borderColor: "white",
                                borderBottomColor: "transparent"
                            }}></span>)}
                            {!loadDelete && ("Sim")}
                        </button>
                    </>
                )}
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
                    {!loading && data && (
                        <Pagination render={(item: any, index) => (
                            <div className="item-lista">
                                <p className='title-list'>{item.title}</p>
                                <div className="editar" onClick={() => {
                                    setModalEdit(true);
                                    setDataEdit(item);
                                    setEditInput(item.title);
                                }}><AiOutlineEdit /></div>
                                <div className="excluir" onClick={() => {
                                    setModal(true);
                                    setIdItem(item.id);
                                }}><AiOutlineDelete /></div>
                            </div>
                        )}
                            perPage={10}
                            data={data}
                        />
                    )}
                </div>
            </div>
        </>

    )
}