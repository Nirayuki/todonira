'use client'
import { usePathname, useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import './styles/slugList.css';

import { FiMoreHorizontal } from 'react-icons/fi';
import listaService from "../../../services/lista.service";
import todoService from "@/services/todo.service";

import { v4 as uuidv4 } from 'uuid';

import Skeleton from "@/components/Skeleton";
import { useAuthContext } from "@/components/authContext";
import { Pagination } from "@/components/Pagination";
import { Dropdown } from "@/components/Dropdown";
import { AiOutlineDelete, AiOutlineEdit, AiOutlineWarning } from "react-icons/ai";
import { Modal } from "@/components/Modal";

export default function ListSlug() {
    const pathname = usePathname();
    const auth = useAuthContext();
    const [title, setTitle] = useState("");
    const [id, setId] = useState("");
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<any>();

    const [todo, setTodo] = useState("");
    const [addTodoLoading, setAddTodoLoading] = useState(false);

    const [modalEdit, setModalEdit] = useState(false);
    const [modalDelete, setModalDelete] = useState(false);
    const [dataEdit, setDataEdit] = useState<any>();
    const [dataDelete, setDataDelete] = useState<any>();
    const [loadingModal, setLoadingModal] = useState(false);
    const router = useRouter();

    const [error, setError] = useState(false);

    useEffect(() => {
        setLoading(true);
        setTitle(pathname.slice(7).split('-').map(word => word.charAt(0).toLocaleUpperCase() + word.slice(1)).join(' '));

        async function fetchData() {
            const queryString = window.location.search;

            if (queryString) {
                const params = new URLSearchParams(queryString);
                const paramId = params.get("id");

                if(paramId){
                    setId(paramId ? paramId : "");
                    const res = await listaService.getLista(paramId);
    
                    setData(res);
                    setLoading(false);
                }else{
                    
                }
            }else{
                router.push("/");
            }
        }

        fetchData();
    }, []);

    async function fetchData() {
        const queryString = window.location.search;

        if (queryString) {
            const params = new URLSearchParams(queryString);
            const paramId = params.get("id");

            setId(paramId ? paramId : "");
            const res = await listaService.getLista(paramId);

            setData(res);
        }
    }

    const onCheck = async (e: any, item: any) => {
        console.log(`E: ${e.target.checked} | Item: ${item}`);

        const res = await listaService.updateTodo(id, {
            id: item.id,
            checked: e.target.checked
        });

        console.log(res);

        if (res) {
            fetchData();
        }
    }

    const handleKeyDown = async (e: any) => {
        if (e.key === "Enter") {
            if (todo === "") {
                setAddTodoLoading(false);
                return
            } else {
                setAddTodoLoading(true);
                const res = await todoService.addTodo(id, {
                    id: uuidv4(),
                    title: todo,
                    checked: false
                });

                if (res) {
                    setTodo("");
                    fetchData();
                }

                setAddTodoLoading(false);
            }
        }
    }

    const onCancelEdit = () => {
        setModalEdit(false);
    }

    const onOkEdit = async () => {
        setLoadingModal(true);
        if (dataEdit.title) {
            const res = await listaService.updateTodo(id, dataEdit);

            if (res) {
                fetchData();
            }

            setLoadingModal(false);
            setModalEdit(false);
        }

        if (!dataEdit.title) {
            setError(true);
            setLoadingModal(false);
        }
    }

    const onCancelDelete = () => {
        setModalDelete(false);
    }

    const onOkDelete = async () => {
        setLoadingModal(true);
        const res = await listaService.deleteTodo(id, dataDelete);
        console.log(res);

        if (res) {
            fetchData();
        }

        setLoadingModal(false);
        setModalDelete(false);
    }

    return (
        <>
            <Modal open={modalEdit} onOk={onOkEdit} onCancel={onCancelEdit}
                footer={(
                    <>
                        <button className='back' onClick={() => onCancelEdit()}>Cancelar</button>
                        <button className='ok' onClick={() => onOkEdit()}>
                            {loadingModal && (<span className="loader" style={{
                                width: "15px",
                                height: "15px",
                                borderColor: "white",
                                borderBottomColor: "transparent"
                            }}></span>)}
                            {!loadingModal && ("Editar")}
                        </button>
                    </>
                )}
                width={600}
            >
                <p>Editar</p>
                <div className="form">
                    <label>Nome do Todo</label>
                    <input type="text" defaultValue={dataEdit?.title} onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            onOkEdit();
                        }
                    }} value={dataEdit?.title} onChange={(e) => {
                        setDataEdit({ ...dataEdit, ["title"]: e.currentTarget.value });
                        setError(false);
                    }} />
                    {error && <p className='error'><AiOutlineWarning /> O campo não pode estar em branco</p>}
                </div>
            </Modal>
            <Modal open={modalDelete} onOk={onOkDelete} onCancel={onCancelDelete} footer={(
                <>
                    <button className='back' onClick={() => onCancelDelete()}>Não</button>
                    <button className='ok' onClick={() => onOkDelete()}>
                        {loadingModal && (<span className="loader" style={{
                            width: "15px",
                            height: "15px",
                            borderColor: "white",
                            borderBottomColor: "transparent"
                        }}></span>)}
                        {!loadingModal && ("Sim")}
                    </button>
                </>
            )}>
                <p>Deseja mesmo excluir?</p>
                <div className="form">
                    <input type="text" disabled value={dataEdit?.title} />
                </div>
            </Modal>
            <div className="container-sluglist">
                {auth?.loading && (
                    <div className="center">
                        <span className="loader"></span>
                    </div>
                )}
                {!auth?.loading && (
                    <>
                        <h2 className="title">
                            {loading ? (
                                <Skeleton width="100%" height="40px" />
                            ) : title}

                        </h2>
                        <input placeholder="Digite uma tarefa..." className="addTarefa" onKeyDown={handleKeyDown} value={todo} disabled={addTodoLoading ? true : false} onChange={(e) => {
                            if(e.currentTarget.value.length <= 150){
                                setTodo(e.currentTarget.value);
                            }else{
                                setTodo(e.currentTarget.value.slice(0, 150))
                            }
                        }} />
                        <div className="line-slug"></div>
                        <h4>Lista</h4>
                        <div className="list-todo">
                            {loading && (
                                <>
                                    <div className="item-list">
                                        <Skeleton width="100%" height="30px" />
                                    </div>
                                    <div className="item-list">
                                        <Skeleton width="100%" height="30px" />
                                    </div>
                                    <div className="item-list">
                                        <Skeleton width="100%" height="30px" />
                                    </div>
                                    <div className="item-list">
                                        <Skeleton width="100%" height="30px" />
                                    </div>
                                    <div className="item-list">
                                        <Skeleton width="100%" height="30px" />
                                    </div>
                                </>
                            )}
                            {data?.todos && (
                                <Pagination
                                    data={data?.todos.reverse()}
                                    render={(item: any, index: number) => (
                                        <div className="item-list" key={index}>
                                            {item.hasOwnProperty("checked") && (<input className="check-todo" type="checkbox" checked={item.checked} onChange={(e) => onCheck(e, item)} />)}
                                            {item.hasOwnProperty("completed") && (<input className="check-todo" type="checkbox" checked={item.completed} onChange={(e) => onCheck(e, item)} />)}
                                            {item.checked || item.completed ? (<del className="title-todo">{item.title ? item.title : item.text}</del>) 
                                            : (<p className="title-todo">{item.title ? item.title : item.text}</p>)}
                                            <Dropdown
                                                item={[
                                                    <div style={{ display: "flex", gap: "5px" }} onClick={() => {
                                                        setModalEdit(true);
                                                        setDataEdit({
                                                            id: item.id,
                                                            title: item.title ? item.title : item.text
                                                        });
                                                    }}><AiOutlineEdit /> Editar</div>,
                                                    <div style={{ display: "flex", gap: "5px", color: "red" }} onClick={() => {
                                                        setModalDelete(true);
                                                        setDataDelete(item.id);
                                                        setDataEdit({
                                                            id: item.id,
                                                            title: item.title ? item.title : item.text
                                                        });
                                                    }}><AiOutlineDelete /> Deletar</div>
                                                ]}
                                            >
                                                <div className="more">
                                                    <FiMoreHorizontal />
                                                </div>
                                            </Dropdown>
                                        </div>
                                    )}
                                    perPage={8}
                                />
                            )}
                        </div>
                    </>
                )}
            </div>

        </>
    )
}