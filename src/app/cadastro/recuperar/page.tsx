'use client'
import { AiOutlineWarning } from 'react-icons/ai';
import '../../../styles/recuperar.css';
import { useState } from 'react';
import { LuKanbanSquare } from 'react-icons/lu';

import { useRouter } from 'next/router';

export default function Recuperar() {
    const [email, setEmail] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const router = useRouter();

    const onSubmit = () => {
        setLoading(true);
    }

    return (
        <div className="container-recuperar">
            <h1>Recuperação de Senha</h1>
            <div className="form">
                <div className="item-form">
                    <label htmlFor="email">Email</label>
                    <input name="email" autoCorrect='off' autoCapitalize='off' spellCheck="false" onChange={(e) => setEmail(e.currentTarget.value)} style={{ borderColor: error ? "red" : undefined }} />
                    {error ? <p className='error'><AiOutlineWarning /> &quot;email&quot; não pode estar em branco.</p> : undefined}
                </div>
                <button style={{ cursor: loading ? "not-allowed" : undefined }} disabled={loading ? true : false} onClick={() => onSubmit()}>Enviar</button>
            </div>
            <div className="line"></div>
            <footer>
                <p>
                    <div className="icon">
                        <LuKanbanSquare />
                    </div>
                    @ 2023 Todonira
                </p>
            </footer>
        </div>
    )
}