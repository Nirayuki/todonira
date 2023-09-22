'use client'
import { useRouter } from 'next/navigation';
import './styles/cadastro.css';
import {useState} from 'react';
import { useAuthContext } from '@/components/authContext';
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineWarning } from 'react-icons/ai';
import { LuKanbanSquare } from 'react-icons/lu';
import userService from '@/services/user.service';

const initForm = {
    nome: "",
    email: "",
    senha: ""
}

const initError = {
    nome: false,
    email: false,
    senha: false
}

export default function Cadastro(){
    const [form, setForm] = useState(initForm);
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    const [error, setError] = useState(initError);
    const router = useRouter();
    const auth = useAuthContext();

    const onChange = (ev: any) => {
        setError(initError);
        setForm({ ...form, [ev.currentTarget.name]: ev.currentTarget.value })
    }

    const onSubmit = async () => {
        setLoading(true);

        if(form.email && form.senha && form.nome){
            const res = await userService.createUser(form);

            if (res === "success") {
                auth?.getUser();
                router.push("/");
                setLoading(false);
            } else {
                setLoading(false);
            }
            setLoading(false);
        }else{
            if(!form.nome){
                setError({...error, ["nome"]: true});
            }

            if(!form.email){
                setError({...error, ["email"]: true});
            }

            if(!form.senha){
                setError({...error, ["senha"]: true});
            }

            setLoading(false);
        }
    }

    return(
        <div className="container-login">
            <h1>Cadastro</h1>
            <div className="form">
            <div className="item-form">
                    <label htmlFor="nome">Nome</label>
                    <input name="nome" autoCorrect='off' autoCapitalize='off' spellCheck="false" onChange={onChange} style={{borderColor: error.nome ? "red" : undefined}}/>
                    {error.nome ? <p className='error'><AiOutlineWarning/> "nome" não pode estar em branco.</p> : undefined}
                </div>
                <div className="item-form">
                    <label htmlFor="email">Email</label>
                    <input name="email" autoCorrect='off' autoCapitalize='off' spellCheck="false" onChange={onChange} style={{borderColor: error.email ? "red" : undefined}}/>
                    {error.email ? <p className='error'><AiOutlineWarning/> "email" não pode estar em branco.</p> : undefined}
                </div>
                <div className="item-form">
                    <label htmlFor="senha">Senha</label>
                    <div className="input-pass" style={{borderColor: error.senha? "red" : undefined}}>
                        <input name="senha" autoCorrect='off' autoCapitalize='off' spellCheck="false" onChange={onChange} type={show ? "text" : "password"} />
                        <div className="show" onClick={() => setShow(!show)}>
                            {!show ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
                        </div>
                    </div>
                    {error.senha ? <p className='error'><AiOutlineWarning/> "senha" não pode estar em branco.</p> : undefined}
                </div>
                <button style={{ cursor: loading ? "not-allowed" : undefined }} disabled={loading ? true : false} onClick={() => onSubmit()}>Entrar</button>
            </div>
            <div className="others">
                <p>Já tem uma conta? <a href="/login">Faça login aqui.</a></p>
                <p>Esqueceu sua senha? <a href="/cadastro/recuperar">Clique aqui.</a></p>
            </div>
            <div className="line"></div>
            <footer>
                <p>
                    <span className="icon">
                        <LuKanbanSquare />
                    </span>
                    @ 2023 Todonira
                </p>
            </footer>
        </div>
    )
}
