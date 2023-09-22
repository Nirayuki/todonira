'use client'
import { useState } from 'react';
import userService from '../../services/user.service';

import '../../styles/login.css';
import { LuKanbanSquare } from 'react-icons/lu';
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineWarning } from 'react-icons/ai';

import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/components/authContext';

const initForm = {
    email: "",
    senha: ""
}

const initError = {
    email: false,
    password: false
}

export default function Login() {
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

        if(form.email && form.senha){
            const res = await userService.signUser(form);

            if (res !== "error") {
                auth?.getUser();
                router.push("/");
                setLoading(false);
            } else {
                setLoading(false);
            }
        }else{
            if(!form.email){
                setError({...error, ["email"]: true});
            }

            if(!form.senha){
                setError({...error, ["password"]: true});
            }
            setLoading(false);
        }
    }

    return (
        <div className="container-login">
            <h1>Login</h1>
            <div className="form">
                <div className="item-form">
                    <label htmlFor="email">Email</label>
                    <input name="email" autoCorrect='off' autoCapitalize='off' spellCheck="false" onChange={onChange} style={{borderColor: error.email ? "red" : undefined}}/>
                    {error.email ? <p className='error'><AiOutlineWarning/> "email" não pode estar em branco.</p> : undefined}
                </div>
                <div className="item-form">
                    <label htmlFor="senha">Senha</label>
                    <div className="input-pass" style={{borderColor: error.password ? "red" : undefined}}>
                        <input name="senha" autoCorrect='off' autoCapitalize='off' spellCheck="false" onChange={onChange} type={show ? "text" : "password"} />
                        <div className="show" onClick={() => setShow(!show)}>
                            {!show ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
                        </div>
                    </div>
                    {error.password ? <p className='error'><AiOutlineWarning/> "senha" não pode estar em branco.</p> : undefined}
                </div>
                <button style={{ cursor: loading ? "not-allowed" : undefined }} disabled={loading ? true : false} onClick={() => onSubmit()}>
                    {loading ? (
                        <span className="loader" style={{
                            width: "15px",
                            height: "15px",
                            borderColor: "white",
                            borderBottomColor: "transparent"
                        }}></span>
                    ) : "Entrar"}
                </button>
            </div>
            <div className="others">
                <p>Novo no Todonira? <a href="/cadastro">Crie sua conta aqui.</a></p>
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