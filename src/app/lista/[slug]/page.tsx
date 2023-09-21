'use client'
import { usePathname, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import './styles/slugList.css';

import {FiMoreHorizontal} from 'react-icons/fi';
import listaService from "../../../services/lista.service";

export default function ListSlug(){
    const pathname = usePathname();
    const [title, setTitle] = useState("");
    const [id, setId] = useState("");
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<any>();

    useEffect(() => {
        setLoading(true);
        setTitle(pathname.slice(7).split('-').map(word => word.charAt(0).toLocaleUpperCase() + word.slice(1)).join(' '));

        async function fetchData(){
            const queryString = window.location.search;
        
            if(queryString){
                const params = new URLSearchParams(queryString);
                const paramId = params.get("id");

                setId(paramId ? paramId : "");
                const res = await listaService.getLista(paramId);
                
                setData(res);
            }
        }

        fetchData();
    }, [])

    const onCheck = (e: any, item: any) => {
        console.log(`E: ${e.target.checked} | Item: ${item}`)
    }

    return(
        <div className="container-sluglist">
            <h2 className="title">
                {title}
            </h2>
            <input placeholder="Digite uma tarefa..." className="addTarefa"/>
            <div className="line-slug"></div>
            <h4>Lista</h4>
            <div className="list-todo">
                {data && data.todos.map((item: any, key: number) => {
                    return(
                        <div className="item-list" key={key}>
                            <input className="check-todo" type="checkbox" checked={item.checked} onChange={(e) => onCheck(e, item)}/>
                            <p className="title-todo">{item.title}</p>
                            <div className="more">
                                <FiMoreHorizontal/>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}