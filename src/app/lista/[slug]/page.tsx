'use client'
import { usePathname, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import './styles/slugList.css';

import { FiMoreHorizontal } from 'react-icons/fi';
import listaService from "../../../services/lista.service";
import todoService from "@/services/todo.service";

import { v4 as uuidv4 } from 'uuid';
import { serverTimestamp } from "firebase/firestore";
import Skeleton from "@/components/Skeleton";
import { useAuthContext } from "@/components/authContext";
import { Pagination } from "@/components/Pagination";

export default function ListSlug() {
    const pathname = usePathname();
    const auth = useAuthContext();
    const [title, setTitle] = useState("");
    const [id, setId] = useState("");
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<any>();

    const [todo, setTodo] = useState("");
    const [addTodoLoading, setAddTodoLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        setTitle(pathname.slice(7).split('-').map(word => word.charAt(0).toLocaleUpperCase() + word.slice(1)).join(' '));

        async function fetchData() {
            const queryString = window.location.search;

            if (queryString) {
                const params = new URLSearchParams(queryString);
                const paramId = params.get("id");

                setId(paramId ? paramId : "");
                const res = await listaService.getLista(paramId);

                setData(res);
                setLoading(false);
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

    return (
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
                    <input placeholder="Digite uma tarefa..." className="addTarefa" onKeyDown={handleKeyDown} value={todo} disabled={addTodoLoading ? true : false} onChange={(e) => setTodo(e.currentTarget.value)} />
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
                                        <input className="check-todo" type="checkbox" checked={item.checked ? item.checked : item.completed} onChange={(e) => onCheck(e, item)} />
                                        <p className="title-todo">{item.title ? item.title : item.text}</p>
                                        <div className="more">
                                            <FiMoreHorizontal />
                                        </div>
                                    </div>
                                )}
                                perPage={8}
                            />
                        )}
                    </div>
                </>
            )}
        </div>
    )
}