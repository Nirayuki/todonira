'use client'
import { useState} from 'react';
import './styles/novalista.css';

import {AiOutlineWarning} from 'react-icons/ai';
import listaService from '@/services/lista.service';

import { useRouter } from 'next/navigation';

const initForm = {
    nome: "",
    codigo: ""
}


const initError = {
    nome: false,
    codigo: false,
    errorService: false,
}

export default function NovaLista() {
    const [nomeList, setNomeList] = useState("");
    const [errorNome, setErrorNome] = useState(false);
    const [form, setForm] = useState(initForm);
    const [errorForm, setErrorForm] = useState(initError);

    const [submitting, setSubmitting] = useState(false);
    const [loadNew, setLoadNew] = useState(false);
    const [loadImport, setLoadImport] = useState(false);
    const [notResNew, setNotResNew] = useState(false);
    const [notResImport, setNotResImport] = useState(false);

    const router = useRouter();
    
    return(
        <div className="container-novalist">
            <h3 className="title">
                Nova Lista
            </h3>
            {notResNew && (<p className='error' style={{marginTop: "10px"}}><AiOutlineWarning/> Algo deu errado! Tente novamente.</p>)}
            <div className="form-nova">
                <div className="item-form">
                    <label htmlFor="nome">Nome da Lista</label>
                    <input type="text" name="nome" onChange={(e) => {
                        setNomeList(e.currentTarget.value);
                        setErrorNome(false);
                        setNotResNew(false);
                    }}/>
                    {errorNome && <p className='error'><AiOutlineWarning/> O campo "nome" não pode estar em branco</p>}
                </div>
                <button style={{cursor: submitting ? "not-allowed" : "pointer"}} disabled={submitting ? true : false} onClick={async () => {
                    if(!nomeList){
                        setErrorNome(true);
                    } else{
                        setSubmitting(true);
                        setLoadNew(true);
                        
                        const res: any = await listaService.addLista(nomeList);

                        setSubmitting(false);
                        setLoadNew(false);
                        if(res){
                            router.push(`/lista/${nomeList.replace(/ /g, "-").toLocaleLowerCase()}?id=${res}`);
                        }else{
                            setNotResNew(true);
                        }
                    }
                }}>{submitting && loadNew ? (<span className="loader" style={{
                    width: "15px",
                    height: "15px",
                    borderColor: "white",
                    borderBottomColor: "transparent"
                }}></span>) : "Criar"}</button>
            </div>

            <div className="line-complex">
                <div className="line"></div>
                <p>OU</p>
                <div className="line"></div>
            </div>

            <h3 className="title">Importar Lista</h3>
            {notResImport && (<p className='error' style={{marginTop: "10px"}}><AiOutlineWarning/> Algo deu errado! Tente novamente.</p>)}
            <div className="form-nova">
                <div className="item-form">
                    <label htmlFor="">Nome da Lista</label>
                    <input type="text" name="nome" onChange={(e) => {
                        setForm({...form, [e.currentTarget.name]: e.currentTarget.value});
                        setErrorForm(initError);
                        setNotResImport(false);
                    }}/>
                    {errorForm.nome && <p className='error'><AiOutlineWarning/> O campo "nome da lista" não pode estar em branco</p>}
                </div>
                <div className="item-form">
                    <label htmlFor="">Código da Lista</label>
                    <input type="text" name="codigo" onChange={(e) => {
                        setForm({...form, [e.currentTarget.name]: e.currentTarget.value});
                        setErrorForm(initError);
                        setNotResImport(false);
                    }}/>
                    {errorForm.codigo && <p className='error'><AiOutlineWarning/> O campo "código" não pode estar em branco</p>}
                </div>
                <button style={{cursor: submitting ? "not-allowed" : "pointer"}} disabled={submitting ? true : false} onClick={async () => {
                    if(form.codigo && form.nome){
                        setSubmitting(true);
                        setLoadImport(true);
                        const res: any = await listaService.importarLista(form);
                        if(res){
                            router.push(`/lista/${form.nome.replace(/ /g, "-").toLocaleLowerCase()}?id=${res}`);
                        }else{
                            setNotResImport(true);
                        }

                        setSubmitting(false);
                        setLoadImport(false);
                    }else{
                        if(!form.codigo){
                            setErrorForm({...errorForm, ["codigo"]: true});
                        }

                        if(!form.nome){
                            setErrorForm({...errorForm, ["nome"]: true});
                        }
                    }
                }}>{submitting && loadImport ? (<span className="loader" style={{
                    width: "15px",
                    height: "15px",
                    borderColor: "white",
                    borderBottomColor: "transparent"
                }}></span>) : "Importar"}</button>
            </div>
        </div>
    )
}